import { IconNames } from "@blueprintjs/icons";

export const iconMapping = {
  person: IconNames.Person,
  applications: IconNames.Applications,
  labTest: IconNames.LabTest,
  database: IconNames.Database,
  automaticUpdates: IconNames.AutomaticUpdates,
  dataconnection: IconNames.DataConnection,
  build: IconNames.Build,
  schedule : IconNames.TimelineEvents,
  jobs: IconNames.Form,
  history: IconNames.History,
  home: IconNames.HOME,
  audit: IconNames.Saved,
  dashboard: IconNames.Dashboard,
  panelStats: IconNames.PanelStats,
};



export const sidebarJson = [
  {
    path: "/upload-document",
    name: "Upload Document",
    icon: iconMapping.jobs,
    roleId: [1, 2, 3, 5],
    subMenu: [],
  },
  // {
  //   path: "/injest-doc-repo",
  //   name: "Ingest Doc Repository",
  //   icon: iconMapping.schedule,
  //   roleId: [1],
  //   subMenu: [],
  // },
  // {
  //   path: "/create-job",
  //   name: "Create Job",
  //   icon: iconMapping.person,
  //   roleId: [1],
  //   subMenu: [],
  // },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: iconMapping.dashboard,
    roleId: [1, 2, 3],
    subMenu: [],
  },
  // {
  //   path: "/audit",
  //   name: "View Reduction",
  //   icon: iconMapping.audit,
  //   roleId:[1,3],
  //   subMenu:[],
  // },
  // {
  //   path: "/reports",
  //   name: "Reports",
  //   icon: iconMapping.panelStats,
  //   roleId: [1, 2, 3],
  //   subMenu: [],
  // },

];
