import { Button, Dialog, DialogActions, MenuItem, Select } from "@mui/material";
import { TeamID } from "../../../util";
import { usePlayersContext } from "../../../providers/PlayersProvider/PlayersProvider";
import { useMemo, useRef, useState } from "react";
import "./swap-team.css";
import { v4 as uuid } from "uuid";
import { useOnClickOutside } from "../../../hooks";

interface ISwapTeam {
  playerId: string;
  open: boolean;
  handleOpen: () => void;
  handleSwapTeam: (teamId: TeamID) => void;
  handleClose: () => void;
}

const SwapTeam = (props: ISwapTeam) => {
  const { handleClose, handleOpen, handleSwapTeam, open, playerId } = props;

  const { getPlayerById, teams } = usePlayersContext();
  const player = useMemo(() => getPlayerById(playerId), [playerId]);

  const [selectedTeamId, setSelectedTeamId] = useState<TeamID>(0);

  const dialogRef = useRef<HTMLDivElement>(null);

  //   useOnClickOutside(dialogRef, () => handleClose());
  return (
    <Dialog
      hideBackdrop
      className="swap-team-dialog-container"
      open={open}
      classes={{ paper: "swap-team-container" }}
      onClose={handleClose}
    >
      <div className="dialog-content" ref={dialogRef}>
        Select team
        <Select
          value={selectedTeamId}
          onChange={(event) => {
            setSelectedTeamId(event.target.value as TeamID);
          }}
        >
          {Object.keys(teams).map((teamId) => (
            <MenuItem value={teamId} className="role menu-item" key={uuid()}>
              {parseInt(teamId) + 1}
            </MenuItem>
          ))}
        </Select>
        <DialogActions className="swap-team-actions">
          <Button onClick={() => handleSwapTeam(selectedTeamId)}>OK</Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default SwapTeam;
