
import { useRef, useMemo, useEffect } from "react";

import { CustomColumn } from "src/core/types";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";
import { useGetComprasMensuales } from "src/api/productos";
import { IgetComprasMensuales } from 'src/types/productos';


// ----------------------------------------------------------------------

type Props = {
  params: IgetComprasMensuales;
  setDataCompras: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function ComprasMensualesDTQ({ params, setDataCompras }: Props) {

  const ref = useRef();
  const config = useGetComprasMensuales(params);
  const tabComprasMen = useDataTableQuery({ config, ref });

  const { data } = tabComprasMen;

  // Asigna la data al grafico
  useEffect(() => {
    if (data) {
      const res = data.map(function (col) {
        return col.cantidad;
      });
      setDataCompras(res)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'periodo', visible: false
    },
    {
      name: 'nombre_gemes', label: 'Mes', size: 150, visible: true
    },
    {
      name: 'num_facturas', label: '# Facturas', size: 80
    },
    {
      name: 'cantidad', size: 120
    },
    {
      name: 'total', size: 120, visible: false
    },

  ], []);

  return (
    <>
      <DataTableQuery
        ref={ref}
        useDataTableQuery={tabComprasMen}
        customColumns={customColumns}
        numSkeletonCols={4}
        height={337}
        orderable={false}
        showToolbar={false}
        showPagination={false}
      />
    </>
  );

}


