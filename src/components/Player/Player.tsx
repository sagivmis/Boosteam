import { StarOutlineRounded, Whatshot } from "@mui/icons-material";
import { avatars } from "../../assets";
import {
  roleColorMapping,
  TeamPlayer,
  tierByRoleColorMapping,
  tierColorMapping,
} from "../../util";
import "./player.css";
import { Checkbox, Chip, IconButton, Menu, MenuItem } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { usePlayersContext } from "../../providers/PlayersProvider/PlayersProvider";
import { useOnClickOutside } from "../../hooks";
import clsx from "clsx";
import Delete from "@mui/icons-material/Delete";
import Swap from "@mui/icons-material/SwapHoriz";

interface IPlayer {
  player: TeamPlayer;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onClickDelete?: () => void;
  onClickSwap?: () => void;
}
const Player = (props: IPlayer) => {
  const { player, onClick, onClickDelete, onClickSwap } = props;
  const playerContainerRef = useRef(null);
  const [isChecked, setIsChecked] = useState(player.checked);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  const { handleToggleCheckPlayer, teams, handleAssignTeam } =
    usePlayersContext();

  const handleCheckPlayer = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsChecked((prevCheck) => !prevCheck);
    handleToggleCheckPlayer(player.id);
  };

  const handleClickPlayer = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick && onClick(event);
    setIsToolbarOpen(true);
  };

  useOnClickOutside(playerContainerRef, () => setIsToolbarOpen(false));
  return (
    <div
      className="player-container"
      onClick={handleClickPlayer}
      ref={playerContainerRef}
    >
      {/* <Checkbox
        checked={isChecked}
        onChange={handleCheckPlayer}
        color="default"
        className="player-checkbox"
      /> */}

      <div
        className={clsx("player-toolbar-container", { clicked: isToolbarOpen })}
      >
        <IconButton
          className="delete-player-btn toolbar-btn"
          onClick={onClickDelete}
        >
          <Delete className="delete-icon toolbar-icon" />
        </IconButton>
        <IconButton className="swap-team-btn toolbar-btn" onClick={onClickSwap}>
          <Swap className="swap-icon toolbar-icon" />
        </IconButton>
      </div>
      {player.tier === "S" &&
        (player.role === "dps" || player.role === "support") && (
          <div className="flame-container">
            <Whatshot className="flame-icon" />
          </div>
        )}
      <img src={avatars.christian} alt="avatar" className="avatar-img" />
      <div className="player-info-container">
        {/* <Chip
          label={player.tier}
          className="tier-chip-container"
          classes={{ label: "tier-chip-label" }}
          color={tierByRoleColorMapping[player.role][player.tier] as any}
        /> */}
        {player.assignedTeamId && (
          <Chip
            label={`${parseInt(player.assignedTeamId.toString()) + 1}`}
            className="tier-chip-container"
            classes={{ label: "tier-chip-label" }}
            color={tierByRoleColorMapping[player.role][player.tier] as any}
          />
        )}
        <Chip
          label={`${player.role}`}
          className="role-chip-container"
          classes={{ label: "tier-chip-label" }}
          color={roleColorMapping[player.role] as any}
        />
        <span className="player-info player-name">{player.name}</span>
      </div>
    </div>
  );
};

export default Player;
