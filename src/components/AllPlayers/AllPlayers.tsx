import {
  Avatar,
  Button,
  FormControl,
  Icon,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import "./all-players.css";
import { ChangeEvent, useCallback, useState } from "react";
import {
  dummyPlayers,
  roles,
  tiers,
  type PlayerRole,
  type PlayerTier,
  type SelectablePlayer,
} from "../../util";
import CheckBox from "@mui/icons-material/CheckBox";
import Player from "../Player";
import { usePlayersContext } from "../../providers/PlayersProvider/PlayersProvider";
import { v4 as uuid } from "uuid";

const AllPlayers = () => {
  const { players, handleAddPlayer } = usePlayersContext();

  const [isCreating, setIsCreating] = useState(false);
  const [tier, setTier] = useState<PlayerTier>("S");
  const [role, setRole] = useState<PlayerRole>("dps");
  const [name, setName] = useState<string>("");

  const resetPlayer = () => {
    setName("");
  };

  const createNewPlayer = useCallback(() => {
    if (name && role && tier) {
      handleAddPlayer({ name, role, tier });
      resetPlayer();
    }
  }, [name, role, tier]);

  const startCreatePlayer = () => setIsCreating(true);

  const handleChangeRole = (event: SelectChangeEvent) => {
    setRole(event.target.value as PlayerRole);
  };
  const handleChangeTier = (event: SelectChangeEvent) => {
    setTier(event.target.value as PlayerTier);
  };

  return (
    <div className="players-input-container">
      <div className="add-player-container players-input">
        <h5 className="tab-header">Team Selection</h5>
        {/* <FormControl className="team-selection-form"> */}
        <div className="team-selection-header">
          <Button
            className="add-player-btn  full-width-btn"
            onClick={startCreatePlayer}
            sx={{ visibility: isCreating ? "hidden" : "visible" }}
          >
            add a player
          </Button>
          <div
            className="new-player-container"
            style={{ visibility: isCreating ? "visible" : "hidden" }}
          >
            {/* <img
                src={avatars.christian}
                alt="avatar"
                className="avatar-img"
              /> */}
            <h6 className="label">Name: </h6>
            <TextField
              variant={"outlined"}
              className="name-input-container"
              value={name}
              slotProps={{ htmlInput: { className: "name-input" } }}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setName(event.target.value);
              }}
            />

            <>
              <h6 className="label">Tier: </h6>
              <Select
                className="tier-select select"
                value={tier}
                onChange={handleChangeTier}
                classes={{
                  icon: "tier-select-icon",
                  select: "tier-select-view",
                }}
              >
                {tiers.map((tier) => (
                  <MenuItem
                    value={tier}
                    className="tier  menu-item"
                    key={uuid()}
                  >
                    {tier}
                  </MenuItem>
                ))}
              </Select>
            </>

            <>
              <h6 className="label">Role: </h6>
              <Select
                className="role-select select"
                value={role}
                onChange={handleChangeRole}
                classes={{
                  icon: "role-select-icon",
                  select: "role-select-view",
                  nativeInput: "ss",
                }}
                // sx={{ borderColor: "none" }}
              >
                {roles.map((role) => (
                  <MenuItem
                    value={role}
                    className="role menu-item"
                    key={uuid()}
                  >
                    {role.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </>

            <IconButton
              className="submit-create-player-btn"
              disabled={!role || !tier || !name}
              onClick={createNewPlayer}
            >
              <CheckBox className="checkbox-icon" />
            </IconButton>
          </div>
        </div>
        <div className="team-selection-body">
          <div className="all-team-container">
            <div className="players-list">
              {players.map((player) => (
                <Player player={player} key={player.id} />
              ))}
            </div>
          </div>
        </div>
        {/* </FormControl> */}
      </div>
    </div>
  );
};

export default AllPlayers;
