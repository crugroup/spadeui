import FilesIcon from "../../../public/icons/files-icon";
import FileIcon from "../../../public/icons/file-icon";
import FileProcessorsIcon from "../../../public/icons/file-processors-icon";
import ExecutorsIcon from "../../../public/icons/executors-icon";
import ProcessesIcon from "../../../public/icons/processes-icon";
import SettingsIcon from "../../../public/icons/settings-icon";
import FormatListIcon from "../../../public/icons/format-list-icon";
import GroupIcon from "../../../public/icons/group-icon";

export const MENU_ADMIN_TAB = "admin";
export const MENU_USER_TAB = "work";

export default [
  {
    name: MENU_USER_TAB,
    meta: {
      label: "Work",
      icon: <FormatListIcon />,
    },
  },
  {
    name: MENU_ADMIN_TAB,
    meta: {
      label: "Admin",
      icon: <SettingsIcon />,
    },
  },
  {
    name: "files",
    parentName: "work",
    list: "/files",
    create: "/files/create",
    edit: "/files/edit/:id",
    show: "/files/show/:id",
    meta: {
      canDelete: true,
      icon: <FilesIcon />,
    },
  },
  {
    name: "processes",
    parentName: "work",
    list: "/processes",
    create: "/processes/create",
    edit: "/processes/edit/:id",
    show: "/processes/show/:id",
    meta: {
      canDelete: true,
      icon: <ProcessesIcon />,
    },
  },
  {
    name: "fileformats",
    parentName: "admin",
    list: "/fileformats",
    create: "/fileformats/create",
    edit: "/fileformats/edit/:id",
    show: "/fileformats/show/:id",
    meta: {
      canDelete: true,
      label: "File formats",
      icon: <FileIcon />,
    },
  },
  {
    name: "fileprocessors",
    parentName: "admin",
    list: "/fileprocessors",
    create: "/fileprocessors/create",
    edit: "/fileprocessors/edit/:id",
    show: "/fileprocessors/show/:id",
    meta: {
      canDelete: true,
      label: "File processors",
      icon: <FileProcessorsIcon />,
    },
  },
  {
    name: "executors",
    parentName: "admin",
    list: "/executors",
    create: "/executors/create",
    edit: "/executors/edit/:id",
    show: "/executors/show/:id",
    meta: {
      canDelete: true,
      icon: <ExecutorsIcon />,
    },
  },
  {
    name: "groups",
    parentName: "admin",
    list: "/groups",
    create: "/groups/create",
    edit: "/groups/edit/:id",
    show: "/groups/show/:id",
    meta: {
      canDelete: true,
      icon: <GroupIcon />,
    },
  },
  {
    name: "permissions",
    list: "/permissions",
    meta: {
      canDelete: false,
      hide: true,
    },
  },
];
