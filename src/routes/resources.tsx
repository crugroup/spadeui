import FilesIcon from "../../public/icons/files-icon";
import FileIcon from "../../public/icons/file-icon";
import FileProcessorsIcon from "../../public/icons/file-processors-icon";
import ExecutorsIcon from "../../public/icons/executors-icon";
import ProcessesIcon from "../../public/icons/processes-icon";

export default [
  {
    name: "files",
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
    name: "fileformats",
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
    name: "processes",
    list: "/processes",
    create: "/processes/create",
    edit: "/processes/edit/:id",
    show: "/processes/show/:id",
    meta: {
      canDelete: true,
      icon: <ProcessesIcon />,
    },
  },
];
