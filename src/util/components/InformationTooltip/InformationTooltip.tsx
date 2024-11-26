import React, { useMemo } from "react";
import "./information-tooltip.css";
import Info from "@mui/icons-material/InfoOutlined";
import { Tooltip } from "@mui/material";

interface IInformationTooltip {
  info: string[];
}

const InformationTooltip = (props: IInformationTooltip) => {
  const { info } = props;

  return (
    <Tooltip
      classes={{ tooltip: "tooltip-container" }}
      title={
        <div className="information-lines">
          {info.map((line) => (
            <span className="line">{line}</span>
          ))}
        </div>
      }
    >
      <Info className="info-icon" />
    </Tooltip>
  );
};

export default InformationTooltip;
