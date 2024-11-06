import { Dialog, IconButton } from "@mui/material";
import { useMemo } from "react";
import "./settings.css";
import {
  calcMinMaxPlayers,
  loadTeamsFromFile,
  saveTeamsToFile,
} from "../../util";
import RatingButtonGroup from "../../util/components/RatingButtonGroup";
import { useSettingsContext } from "../../providers/SettingsProvider/SettingsProvider";
import { v4 as uuid } from "uuid";
import { usePlayersContext } from "../../providers/PlayersProvider/PlayersProvider";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

interface ISettings {
  open: boolean;
  onClose: () => void;
}

const Settings = (props: ISettings) => {
  const { open, onClose } = props;
  const {
    handleLoadSettings,
    handleChangeMaxPlayers,
    handleChangeMinDpsPlayers,
    handleChangeMinSupportPlayers,
    minDpsPlayers,
    maxPlayers,
    minSupportPlayers,
  } = useSettingsContext();

  const { players, teams, handleLoadTeams } = usePlayersContext();
  const settings = useMemo<Setting[]>(
    () => [
      {
        label: "max players",
        selectedSetting: maxPlayers,
        set: handleChangeMaxPlayers,
      },
      {
        label: "min support players",
        selectedSetting: minSupportPlayers,
        set: handleChangeMinSupportPlayers,
      },
      {
        label: "min dps players",
        selectedSetting: minDpsPlayers,
        set: handleChangeMinDpsPlayers,
      },
    ],
    [
      handleChangeMinDpsPlayers,
      handleChangeMaxPlayers,
      handleChangeMinSupportPlayers,
      minDpsPlayers,
      minSupportPlayers,
      maxPlayers,
    ]
  );

  const handleClose = (value: string) => {
    onClose();
  };

  const handleSave = () => {
    saveTeamsToFile(players, teams, {
      maxPlayers,
      minDpsPlayers,
      minSupportPlayers,
    });
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadTeamsFromFile(file, (data) => {
        handleLoadTeams(data.players, data.teams);
        console.log(data.settings);
        handleLoadSettings(data.settings);
        onClose();
      });
    }
  };

  const totalTeams = useMemo(
    () => players.length / maxPlayers,
    [players, maxPlayers]
  );

  const genMinDisabledSelections = (length: number, reverse = false) => {
    return Array.from(
      {
        length,
      },
      (v, i) => (!reverse ? i : length - i)
    );
  };

  const genMaxDisabledSelections = (length: number) => {
    return Array.from({ length: 10 }, (v, i) => (i >= length ? i + 1 : -1));
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      className="settings-dialog-container"
      classes={{ container: "container", paper: "settings-container" }}
    >
      <div className="settings-list">
        {settings.map((setting, index) => (
          <div className="setting-container" key={uuid()}>
            <h4 className="setting-title">{setting.label}</h4>
            <RatingButtonGroup
              selected={setting.selectedSetting}
              // max={}
              disableSelections={
                setting.label === "max players"
                  ? genMinDisabledSelections(
                      calcMinMaxPlayers(minDpsPlayers, minSupportPlayers)
                    )
                  : setting.label === "min dps players"
                  ? genMaxDisabledSelections(maxPlayers - minSupportPlayers)
                  : setting.label === "min support players"
                  ? genMaxDisabledSelections(maxPlayers - minDpsPlayers)
                  : undefined
              }
              onClick={(value) => {
                setting.set(value);
              }}
            />
          </div>
        ))}
      </div>
      <IconButton className="save-btn" onClick={handleSave}>
        <SaveRoundedIcon />
      </IconButton>

      <input type="file" accept=".json" onChange={handleLoad} />
      <h4 className="total-teams">
        total teams by current settings:{" "}
        {`${Math.ceil(totalTeams)} (${totalTeams.toFixed(1)})`}
      </h4>
    </Dialog>
  );
};

type Setting = {
  label: string;
  selectedSetting: number;
  set: (value: number) => void;
};

export default Settings;
