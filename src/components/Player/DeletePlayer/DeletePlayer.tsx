import { useMemo, useRef, useState } from "react";
import "./delete-player.css";
import { Button, Dialog, DialogActions } from "@mui/material";
import { usePlayersContext } from "../../../providers/PlayersProvider/PlayersProvider";
import { useOnClickOutside } from "../../../hooks";

interface IDeletePlayer {
  playerId: string;
  open: boolean;
  handleOpen: () => void;
  handleDeletePlayer: (playerId: string) => void;
  handleClose: () => void;
}

const DeletePlayer = (props: IDeletePlayer) => {
  const { playerId, open, handleClose, handleDeletePlayer, handleOpen } = props;

  const { getPlayerById } = usePlayersContext();
  const player = useMemo(() => getPlayerById(playerId), [playerId]);
  const dialogRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog
      hideBackdrop
      className="delete-player-dialog-container"
      open={open}
      classes={{ paper: "delete-player-container" }}
      ref={dialogRef}
      onClose={handleClose}
    >
      Delete {player?.name}?
      <DialogActions className="delete-player-actions">
        <Button
          onClick={() => handleDeletePlayer(playerId)}
          className="delete-player-action-btn"
        >
          OK
        </Button>
        <Button
          onClick={handleClose}
          autoFocus
          className="delete-player-action-btn"
        >
          X
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePlayer;
