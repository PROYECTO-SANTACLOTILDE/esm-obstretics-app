/**
 * This is the entrypoint file of the application. It communicates the
 * important features of this microfrontend to the app shell. It
 * connects the app shell to the React application(s) that make up this
 * microfrontend.
 */
import { getAsyncLifecycle, defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import {  dashboardMetaObstetrics } from './dashboardMeta';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
//import AntenatalDetailedSummary from './prenatalCare/prenatalCareChart.component';
import AntenatalProgramSummary from './antenatal-program-summary/antenatal-program-summary.component';

const moduleName = '@openmrs/esm-template-app';

const options = {
  featureName: 'root-world',
  moduleName,
};

const options1 = {
  featureName: 'obstetrics-programs',
  moduleName,
};


/**
 * This tells the app shell how to obtain translation files: that they
 * are JSON files in the directory `../translations` (which you should
 * see in the directory structure).
 */
export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

/**
 * This function performs any setup that should happen at microfrontend
 * load-time (such as defining the config schema) and then returns an
 * object which describes how the React application(s) should be
 * rendered.
 */
export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

/**
 * This named export tells the app shell that the default export of `root.component.tsx`
 * should be rendered when the route matches `root`. The full route
 * will be `openmrsSpaBase() + 'root'`, which is usually
 * `/openmrs/spa/root`.
 */


export const ObstetricsDashboardLink =
  getSyncLifecycle(
    createDashboardLink({...dashboardMetaObstetrics, moduleName,}),
    options1,
  );

  /*export const appointmentsCalendarDashboardLink = getSyncLifecycle(
    createDashboardLink({...appointmentCalendarDashboardMeta, moduleName,}),
    options,
  );*/

//export const antenatalDetailedSummary = getSyncLifecycle(AntenatalDetailedSummary, options1);

export const antenatalProgram = getSyncLifecycle(AntenatalProgramSummary, options);