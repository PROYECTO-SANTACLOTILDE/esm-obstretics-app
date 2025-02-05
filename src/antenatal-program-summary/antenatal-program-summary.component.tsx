import React from 'react';
import { Button, InlineLoading, Tab, Tabs, TabList, TabPanel, TabPanels } from '@carbon/react';
import { EmptyState, ErrorState } from '@openmrs/esm-patient-common-lib';
import { useTranslation } from 'react-i18next';
import styles from './visit-detail-overview.scss';
import AntenatalDetailedSummary from '../prenatalCare/prenatalCareChart.component';
//import AppointmentsCalendarView from '../Calendar/appointments-calendar-view.component';
//import GrowthChart from '../Chart/extentions/growth-chart.component';

interface VisitOverviewComponentProps {
  patientUuid: string;
}

export default function AntenatalSummaryComponent({ patientUuid }: VisitOverviewComponentProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.tabs}>
      <Tabs>
        <TabList aria-label="Visit detail tabs" className={styles.tabList}>
          <Tab className={styles.tab} id="tab-1">
            {t('Antecedentes', 'Antecedentes')}
          </Tab>
          <Tab className={styles.tab} id="tab-2">
            {t('AtencionesPrenatales', 'Atenciones Prenatales')}
          </Tab>
          <Tab className={styles.tab} id="tab-3">
            {t('CronogramaPrenatal', 'Cronograma Prenatal')}
          </Tab>
          <Tab className={styles.tab} id="tab-4">
            {t('GraficasObstétricas', 'Graficas Obstétricas')}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className={styles.tabContent}>
              {/* Aquí puedes agregar el contenido de la pestaña 1 */}
              <p>{t('tab1Content', 'Content for Tab 1')}</p>
            </div>
          </TabPanel>
          <TabPanel>
            <div className={styles.tabContent}>
              {/* Aquí puedes agregar el contenido de la pestaña 2 */}
              <AntenatalDetailedSummary patientUuid={patientUuid} />
            </div>
          </TabPanel>
          <TabPanel>
            <div className={styles.tabContent}>
              {/* Aquí puedes agregar el contenido de la pestaña 3 */}
              
            </div>
          </TabPanel>
          <TabPanel>
            <div className={styles.tabContent}>
              {/* Aquí puedes agregar el contenido de la pestaña 4 */}
              
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
