import { selections } from "../../consts";
import { Button } from "@mui/material";
import "./rating-button-group.css";
import clsx from "clsx";

interface IRatingButtonGroup {
  onClick: (value: number) => void;
  selected: number;
  max?: number;
  disableSelections?: number[];
}

const RatingButtonGroup = (props: IRatingButtonGroup) => {
  const { selected, onClick, disableSelections, max = 10 } = props;
  console.log(disableSelections);

  return (
    <div className="rating-button-group-container">
      {selections.amount.map((b) =>
        b <= max ? (
          <Button
            className={clsx(`rating-btn ${b}`, { selected: selected === b })}
            onClick={() => {
              onClick(b);
            }}
            key={b}
            disabled={disableSelections?.includes(b)}
          >
            {b}
          </Button>
        ) : undefined
      )}
    </div>
  );
};

export default RatingButtonGroup;
