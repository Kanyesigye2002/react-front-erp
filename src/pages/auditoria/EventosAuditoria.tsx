import { useState, useMemo } from 'react';
// @mui
import { Container, Button, Stack, Card } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { LoadingButton } from '@mui/lab';
// services
import { getQueryEventosAuditoria, deleteEventosAuditoria } from '../../services/core/serviceAuditroia';
import { getListDataUsuarios } from '../../services/core/serviceUsuario';
// components
import CalendarRangePicker, { useCalendarRangePicker } from '../../core/components/calendar';
import Dropdown, { useDropdown } from '../../core/components/dropdown';
import { useSettingsContext } from '../../components/settings/SettingsContext';
import { DataTableQuery, useDataTableQuery } from '../../core/components/dataTable';
import { useSnackbar } from '../../components/snackbar';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import ConfirmDialog from '../../components/confirm-dialog';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// util
import { getDateFormat, addDaysDate } from '../../utils/formatTime';
import { Query, CustomColumn } from '../../core/types';

// ----------------------------------------------------------------------

export default function EventosAuditoria() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const queryAudit: Query = getQueryEventosAuditoria();



  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_auac', visible: true
    },
    {
      name: 'fecha_auac', label: 'Fecha', order: 1, filter: false
    },
    {
      name: 'detallE_auac', label: 'Referencia', orderable: false

    },
    {
      name: 'pantalla', size: 250
    }
  ], []);


  const tabAudit = useDataTableQuery({ query: queryAudit, customColumns });
  const calDates = useCalendarRangePicker((addDaysDate(new Date(), -3)), new Date());
  const droUser = useDropdown({ config: getListDataUsuarios() });
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleDeleteAudit = async () => {
    if (calDates.startDate && calDates.endDate && tabAudit.selected) {
      await deleteEventosAuditoria(calDates.startDate, calDates.endDate, tabAudit.selected as string[]);
      tabAudit.onRefresh();
    }
  };

  const handleOpenConfirm = () => {
    if (tabAudit.selectionMode === 'multiple' && tabAudit.selected.length === 0)
      enqueueSnackbar('Selecciona al menos un registro', { variant: 'warning', });
    else
      setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleSearch = () => {
    queryAudit.params.fechaInicio = getDateFormat(calDates.startDate);
    queryAudit.params.fechaFin = getDateFormat(calDates.endDate);
    queryAudit.params.ide_usua = droUser.value === null ? null : Number(droUser.value);
    tabAudit.onRefresh();
  };

  return (
    <>
      <Helmet>
        <title>Eventos Auditoria Usuarios</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Eventos Auditoria Usuarios'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Auditoria',
              href: PATH_DASHBOARD.auditoria.root,
            }
          ]}
          action={
            <Button
              onClick={handleOpenConfirm}
              color="error"
              variant="contained"
              startIcon={<Iconify icon="ic:twotone-delete-outline" />}
            >
              {tabAudit.selectionMode === 'multiple' ? 'Eliminar Seleccionados' : 'Borrar Auditoria'}
            </Button>
          }
        />
      </Container>
      <Card>
        <Stack
          spacing={2}
          alignItems='center'
          direction={{
            xs: 'column',
            md: 'row',
          }}
          sx={{ px: 2.5, py: 3, border: 'radius' }}
        >
          <CalendarRangePicker
            label={calDates.label}
            startDate={calDates.startDate}
            endDate={calDates.endDate}
            maxStartDate={new Date()}
            maxEndDate={new Date()}
            onChangeStartDate={calDates.onChangeStartDate}
            onChangeEndDate={calDates.onChangeEndDate}
            isError={calDates.isError}
          />
          <Dropdown
            label="Usuario"
            useDropdown={droUser}
          />
          <LoadingButton
            loading={tabAudit.loading}
            variant="contained"
            onClick={handleSearch}
            endIcon={<Iconify icon="ic:baseline-search" />}
            fullWidth
          >
            Buscar
          </LoadingButton>
        </Stack>
        <DataTableQuery
          data={tabAudit.data}
          columns={tabAudit.columns}
          primaryKey={tabAudit.primaryKey}
          rows={50}
          loading={tabAudit.loading}
          columnVisibility={tabAudit.columnVisibility}
          defaultOrderBy='fecha_auac'
          numSkeletonCols={7}
          selectionMode={tabAudit.selectionMode}
          selected={tabAudit.selected}
          onRefresh={tabAudit.onRefresh}
          onSelectRow={tabAudit.onSelectRow}
          onSelectAllRows={tabAudit.onSelectAllRows}
          onSelectionModeChange={tabAudit.onSelectionModeChange}
        />
      </Card>


      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Eliminar Auditoría"
        content={
          <>
            {tabAudit.selectionMode === 'multiple' ? `¿Estás seguro de que quieres eliminar ${tabAudit.selected.length} registros?`
              : '¿Estás seguro de que quieres eliminar los registros de Auditoría ?'}
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteAudit();
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
