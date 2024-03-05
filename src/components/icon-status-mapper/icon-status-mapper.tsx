import CheckBoxIcon from "../../../public/icons/check-box-icon";
import CancelIcon from "../../../public/icons/cancel-icon";
import WarningIcon from "../../../public/icons/warning-icon";
import NewIcon from "../../../public/icons/new-icon";
import PendingIcon from "../../../public/icons/pending-icon";
import { Tooltip } from "antd";

const IconStatusMapper = ({ status }: { status: string }) => {
  switch (status) {
    case "finished":
    case "success":
      return (
        <Tooltip title={status} placement="top">
          <span>
            <CheckBoxIcon />
          </span>
        </Tooltip>
      );
    case "failed":
    case "error":
      return (
        <Tooltip title={status} placement="top">
          <span>
            <CancelIcon />
          </span>
        </Tooltip>
      );
    case "warning":
      return (
        <Tooltip title={status} placement="top">
          <span>
            <WarningIcon />
          </span>
        </Tooltip>
      );
    case "new":
      return (
        <Tooltip title={status} placement="top">
          <span>
            <NewIcon />
          </span>
        </Tooltip>
      );
    case "running":
      return (
        <Tooltip title={status} placement="top">
          <span>
            <PendingIcon />
          </span>
        </Tooltip>
      );
    default:
      return <span></span>;
  }
};

export default IconStatusMapper;
