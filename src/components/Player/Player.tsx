import { StarOutlineRounded, Whatshot } from "@mui/icons-material";
import { avatars } from "../../assets";
import {
  roleColorMapping,
  SelectablePlayer,
  tierByRoleColorMapping,
  tierColorMapping,
} from "../../util";
import "./player.css";
import { Checkbox, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { usePlayersContext } from "../../providers/PlayersProvider/PlayersProvider";

interface IPlayer {
  player: SelectablePlayer;
}
const Player = (props: IPlayer) => {
  const { player } = props;
  const [isChecked, setIsChecked] = useState(player.checked);

  const { handleToggleCheckPlayer, teams } = usePlayersContext();

  const handleCheckPlayer = () => {
    setIsChecked((prevCheck) => !prevCheck);
    handleToggleCheckPlayer(player.id);
  };

  return (
    <div className="player-container" onClick={handleCheckPlayer}>
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
