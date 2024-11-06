import { useState } from "react";
import "./delete-player.css";
import { Button, Dialog, DialogActions } from "@mui/material";
import { usePlayersContext } from "../../../providers/PlayersProvider/PlayersProvider";

interface IDeletePlayer {
  playerId: string;
  open: boolean;
  handleOpen: () => void;
  handleDeletePlayer: (playerId: string) => void;
  handleClose: () => void;
}

const DeletePlayer = (props: IDeletePlayer) => {
  const { playerId, open, handleClose, handleDeletePlayer, handleOpen } = props;

  return (
    <div className="delete-player-container">
      <Dialog className="delete-player-dialog-container" open={open}>
        Delete Player?
        <DialogActions>
          <Button onClick={() => handleDeletePlayer(playerId)}>OK</Button>
          <Button onClick={handleClose} autoFocus>
            X
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeletePlayer;
