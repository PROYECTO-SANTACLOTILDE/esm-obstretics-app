import React, { type ComponentProps, useCallback, useEffect, useMemo } from 'react';
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
import { findLastState, useAttentions, usePrograms } from './programs.resource';
import styles from './programs-detailed-summary.scss';
import { formatDateIntl } from './formatDate';


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

  const { prenatalEncounters, error, isValidating} = useAttentions(patientUuid);
  

  let formAntenatalUuid = '414cc661-f7e5-486f-8ca0-5f7eaa9735ab';
  if(prenatalEncounters.length >0) {
    formAntenatalUuid = prenatalEncounters[0].form.uuid;
  }
  // eslint-disable-next-line no-console
  console.log("atenciones prenatales" ,formAntenatalUuid);

  // Función para abrir el formulario en OpenMRS
  const handleAddPrenatalAttention = () => {
    launchPatientWorkspace('patient-form-entry-workspace', {
      workspaceTitle: t('Nueva Atención Prenatal', 'Nueva Atención Prenatal'),
      formInfo: {
        encounterUuid: '',
        formUuid: formAntenatalUuid,
        additionalProps: {},
      },
    });
  };


  const rowHeaders = useMemo(
    () => [
      t('fechaYHoraAtencion', 'Fecha y hora atención'),
      t('edadGestacional', 'Edad Gestacional (semanas)'),
      t('alturaUterina', 'Altura Uterina (cm)'),
      t('situación', 'Situación (L,T,NA)'),
      t('presentación', 'Presentación (C/P/NA)'),
      t('posición', 'Posición (O/I/NA)'),
      t('frecuenciaCardiacaFetal', 'Frecuencia cardiaca fetal(por min.)'),
    ],
    [t]
  ); 
  const headers = [
      {
        key: 'rowHeader',
        header: t('AtencionesPrenatales', 'Atenciones Prenatales'),
      },
    ];
  
  const tableHeaders: Array<typeof DataTableHeader> = useMemo(() => {
    
    for (let i = 1; i <= 9; i++) {
        headers.push({
        key: `atencion${i}`,
        header: t(`atencion${i}`, `Atención ${i}`),
        });
    }
    return headers;
  }, [t]);

  const tableRows = useMemo(() => {
    // Crear una estructura inicial con filas vacías
    const rowDataTemplate = rowHeaders.map((rowHeader, rowIndex) => ({
      id: `row-${rowIndex}`,
      rowHeader,
      ...Array.from({ length: 9 }, (_, i) => ({ [`atencion${i + 1}`]: '--' })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
    }));
  
    // Mapeo de categorías para encontrar dónde colocar cada valor
    const categoryMapping: Record<string, string> = {
      "Fecha y hora atención": "encounterDatetime",
      "Edad Gestacional (semanas)": "Weeks of current gestation",
      "Altura Uterina (cm)": "Fundal height",
      "Situación (L,T,NA)": "Fetal lie",
      "Presentación (C/P/NA)": "Fetal presentation",
      "Posición (O/I/NA)": "Fetus back position",
      "Frecuencia cardiaca fetal(por min.)": "Frecuencia cardíaca fetal"
    };

    prenatalEncounters.forEach((encounter) => {
      let encounterNumber = null;
  
      encounter.obs.forEach((obs) => {
        const match = obs.display.match(/Atención prenatal: Atención (\d+)/);
        if (match) {
          encounterNumber = parseInt(match[1], 10);
        }
      });
  
      // Si encontramos el número de atención, procesamos los datos
      if (encounterNumber && encounterNumber <= 9) {

        const fechaRowIndex = rowHeaders.indexOf("Fecha y hora atención");
        if (fechaRowIndex !== -1) {
          rowDataTemplate[fechaRowIndex][`atencion${encounterNumber}`] = formatDateIntl(encounter.encounterDatetime) || '--';
        }

        encounter.obs.forEach((obs) => {
          for (const [rowHeader, keyword] of Object.entries(categoryMapping)) {
            if (obs.display.includes(keyword)) {
              const rowIndex = rowHeaders.indexOf(rowHeader);
              if (rowIndex !== -1) {
                rowDataTemplate[rowIndex][`atencion${encounterNumber}`] = obs.display.split(": ")[1] || '--';
              }
            }
          }
        });
      }
    });
  
    return rowDataTemplate;
  }, [prenatalEncounters, rowHeaders]);

  if (error) {
    return <div>Error al cargar los datos.</div>;
  }

  if (prenatalEncounters.length === 0) {
    return (
      <EmptyState
        headerTitle={headerTitle}
        displayText={t('sinAtenciones', 'atenciones prenatales')}
        launchForm={handleAddPrenatalAttention}
      />
    );
  }

  return (
    <div>
        <div className={styles.widgetCard} >
            <CardHeader title={headerTitle}>
                <span>{isValidating ? <InlineLoading /> : null}</span>
                <Button onClick={handleAddPrenatalAttention} kind="ghost">
                  {t('add', 'Añadir')}
                </Button>
            </CardHeader>
            <DataTable rows={tableRows} headers={tableHeaders} isSortable size={isTablet ? 'lg' : 'sm'} useZebraStyles>
                {({ rows, headers, getHeaderProps, getTableProps }) => (
                <TableContainer style={{ width: '100%' }}>
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


 {/*function ProgramEditButton({ programEnrollmentId, t }: ProgramEditButtonProps) {
   const isTablet = useLayoutType() === 'tablet';
   const launchEditProgramsForm = useCallback(
     () => launchPatientWorkspace('programs-form-workspace', { programEnrollmentId }),
     [programEnrollmentId],
   );

   return (
     <Button
       aria-label="edit program"
       kind="ghost"
       renderIcon={(props: ComponentProps<typeof EditIcon>) => <EditIcon size={16} {...props} />}
       iconDescription={t('editProgram', 'Edit Program')}
       onClick={launchEditProgramsForm}
       hasIconOnly
       tooltipPosition="left"
       size={isTablet ? 'lg' : 'sm'}
     />
   );
 }*/}
export default AntenatalDetailedSummary;