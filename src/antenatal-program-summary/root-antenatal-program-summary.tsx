import React from 'react';
import AntenatalSummaryComponent from './antenatal-program-summary.component';

export interface VisitOverviewComponentProps {
  patientUuid: string;
}
//no hace nada
export default function RootActiveProgramSummary({ patientUuid }: VisitOverviewComponentProps) {
  return (
    <div>
      <AntenatalSummaryComponent patientUuid={patientUuid} />
    </div>
  );
}
