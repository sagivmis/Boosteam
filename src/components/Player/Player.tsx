import { StarOutlineRounded, Whatshot } from "@mui/icons-material";
import { avatars } from "../../assets";
import {
  roleColorMapping,
  SelectablePlayer,
  tierByRoleColorMapping,
  tierColorMapping,
} from "../../util";
import "./player.css";
import { Checkbox, Chip, Menu, MenuItem } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { usePlayersContext } from "../../providers/PlayersProvider/PlayersProvider";
import { useOnClickOutside } from "../../hooks";

interface IPlayer {
  player: SelectablePlayer;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
const Player = (props: IPlayer) => {
  const { player, onClick } = props;
  const menuRef = useRef(null);
  const [isChecked, setIsChecked] = useState(player.checked);

  const { handleToggleCheckPlayer, teams } = usePlayersContext();

  const handleCheckPlayer = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsChecked((prevCheck) => !prevCheck);
    handleToggleCheckPlayer(player.id);
  };

  return (
    <div className="player-container" onClick={onClick}>
      {/* <Checkbox
        checked={isChecked}
        onChange={handleCheckPlayer}
        color="default"
        className="player-checkbox"
      /> */}

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
