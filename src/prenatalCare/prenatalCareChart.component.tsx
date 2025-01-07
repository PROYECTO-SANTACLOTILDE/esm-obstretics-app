import React, { type ComponentProps, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { type TFunction, useTranslation } from 'react-i18next';
import {
  Button,
  DataTable,
  type DataTableHeader,
  DataTableSkeleton,
  InlineLoading,
  InlineNotification,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import {
  AddIcon,
  type ConfigObject,
  EditIcon,
  formatDate,
  formatDatetime,
  useConfig,
  useLayoutType,
  isDesktop as desktopLayout,
} from '@openmrs/esm-framework';
import { CardHeader, EmptyState, ErrorState, launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import { findLastState, usePrograms } from './programs.resource';
import styles from './programs-detailed-summary.scss';

interface ProgramsDetailedSummaryProps {
  patientUuid: string;
}

interface ProgramEditButtonProps {
  programEnrollmentId: string;
  t: TFunction;
}

const AntenatalDetailedSummary: React.FC<ProgramsDetailedSummaryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const headerTitle = t('Cuidado prenatal', 'Cuidado prenatal');

  const { enrollments, isLoading, error, isValidating, availablePrograms } = usePrograms(patientUuid);


  const rowHeaders = useMemo(
    () => [
      t('fechaYHoraAtencion', 'Fecha y hora atención'),
      t('edadGestacional', 'Edad Gestacional (semanas)'),
      t('pesoMadre', 'Peso Madre (kg)'),
      t('temperatura', 'Temperatura (°C)'),
      t('presionArterial', 'Presión arterial (mmHg)'),
      t('pulsoMaterno', 'Pulso Materno (por min.)'),
      t('alturaUterina', 'Altura Uterina (cm)'),
    ],
    [t]
  );

  const tableHeaders: Array<typeof DataTableHeader> = useMemo(() => {
    
    const headers = [
        {
        key: 'rowHeader',
        header: t('AtencionesPrenatales', 'Atenciones Prenatales'), // Encabezado de la primera columna
        },
    ];

    // Agregar columnas de atenciones estáticas
    for (let i = 1; i <= 9; i++) {
        headers.push({
        key: `atencion${i}`,
        header: t(`atencion${i}`, `Atención ${i}`),
        });
    }

    return headers;
    }, [t]);

  const tableRows = useMemo(() => {
    return rowHeaders.map((rowHeader, rowIndex) => {
      const rowData: Record<string, string> = { id: `row-${rowIndex}`, rowHeader };

      // Inicializar las columnas con valores vacíos
      for (let colIndex = 1; colIndex <= 9; colIndex++) {
        rowData[`atencion${colIndex}`] = '--';
      }

      return rowData;
    });
  }, [rowHeaders]);

  
    return (
    <div>
        <div className={styles.additionalInfo} >
            <ul>
            <li>
                <strong>{t('edadGestacional', 'Edad gestacional')}:</strong> 3 semanas
            </li>
            <li>
                <strong>{t('datosParto', 'Datos del parto')}:</strong> 10/05/2025
            </li>
            <li>
                <strong>{t('factoresRiesgo', 'Factores de riesgo')}:</strong> lista
            </li>
            <li>
                <strong>{t('tipoEmbarazo', 'Tipo de embarazo')}:</strong> Normal
            </li>
            </ul>
        </div>
        <div className={styles.widgetCard}>
            <CardHeader title={headerTitle}>
                <span>{isValidating ? <InlineLoading /> : null}</span>
                </CardHeader>
            <DataTable rows={tableRows} headers={tableHeaders} isSortable size={isTablet ? 'lg' : 'sm'} useZebraStyles>
                {({ rows, headers, getHeaderProps, getTableProps }) => (
                <TableContainer>
                    <Table aria-label="Tabla de cuidado prenatal" {...getTableProps()}>
                    <TableHead>
                        <TableRow>
                        {headers.map((header) => (
                            <TableHeader
                            className={classNames(styles.productiveHeading01, styles.text02)}
                            {...getHeaderProps({
                                header,
                                isSortable: header.isSortable,
                            })}
                            >
                            {header.header?.content ?? header.header}
                            </TableHeader>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.cells.map((cell) => (
                            <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                            ))}
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
                )}
            </DataTable>
        </div> 
    </div>
   
  );
};


// function ProgramEditButton({ programEnrollmentId, t }: ProgramEditButtonProps) {
//   const isTablet = useLayoutType() === 'tablet';
//   const launchEditProgramsForm = useCallback(
//     () => launchPatientWorkspace('programs-form-workspace', { programEnrollmentId }),
//     [programEnrollmentId],
//   );

//   return (
//     <Button
//       aria-label="edit program"
//       kind="ghost"
//       renderIcon={(props: ComponentProps<typeof EditIcon>) => <EditIcon size={16} {...props} />}
//       iconDescription={t('editProgram', 'Edit Program')}
//       onClick={launchEditProgramsForm}
//       hasIconOnly
//       tooltipPosition="left"
//       size={isTablet ? 'lg' : 'sm'}
//     />
//   );
// }
export default AntenatalDetailedSummary;