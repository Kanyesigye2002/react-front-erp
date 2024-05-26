import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';

import Iconify from 'src/components/iconify';
import { shortDateLabel } from 'src/components/custom-date-range-picker';

import { IFileFilters, IFileFilterValue } from 'src/types/file';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IFileFilters;
  onFilters: (name: string, value: IFileFilterValue) => void;
  //
  canReset: boolean;
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function FileManagerFiltersResult({
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const shortLabel = shortDateLabel(filters.startDate, filters.endDate);

  const handleRemoveKeyword = useCallback(() => {
    onFilters('name', '');
  }, [onFilters]);

  const handleRemoveTypes = useCallback(
    (inputValue: string) => {
      const newValue = filters.type.filter((item) => item !== inputValue);

      onFilters('type', newValue);
    },
    [filters.type, onFilters]
  );

  const handleRemoveDate = useCallback(() => {
    onFilters('startDate', null);
    onFilters('endDate', null);
  }, [onFilters]);

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.50 }}>
          resultados encontrados
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.type.length && (
          <Block label="Tipos:">
            {filters.type.map((item) => (
              <Chip key={item} label={item} size="small" onDelete={() => handleRemoveTypes(item)} />
            ))}
          </Block>
        )}

        {filters.startDate && filters.endDate && (
          <Block label="Fecha:">
            <Chip size="small" label={shortLabel} onDelete={handleRemoveDate} />
          </Block>
        )}

        {!!filters.name && (
          <Block label="Palabra clave:">
            <Chip label={filters.name} size="small" onDelete={handleRemoveKeyword} />
          </Block>
        )}

        {canReset && (
          <Button
            color="error"
            onClick={onResetFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            Limpiar
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
