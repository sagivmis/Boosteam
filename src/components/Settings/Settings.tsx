import {
  Box,
  Checkbox,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
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
import Save from "@mui/icons-material/SaveRounded";
import Folder from "@mui/icons-material/Folder";
import FileDownload from "@mui/icons-material/FileDownload";
import Check from "@mui/icons-material/Check";

interface ISettings {
  open: boolean;
  onClose: () => void;
}

const Settings = (props: ISettings) => {
  const { open, onClose } = props;
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [loadSuccess, setLoadSuccess] = useState(false);

  const {
    handleLoadSettings,
    handleChangeMaxPlayers,
    handleChangeMinDpsPlayers,
    handleChangeMinSupportPlayers,
    handleChangeSyncSwaps,
    syncSwaps,
    minDpsPlayers,
    maxPlayers,
    minSupportPlayers,
  } = useSettingsContext();

  const { players, teams, handleLoadTeams } = usePlayersContext();

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

  const settings = useMemo<Setting[]>(
    () => [
      {
        label: "max players",
        selectedSetting: maxPlayers,
        set: handleChangeMaxPlayers,
        variant: "rating",
        filter: {
          callback: genMinDisabledSelections,
          length: calcMinMaxPlayers(minDpsPlayers, minSupportPlayers),
        },
      },
      {
        label: "min support players",
        selectedSetting: minSupportPlayers,
        set: handleChangeMinSupportPlayers,
        variant: "rating",
        filter: {
          callback: genMaxDisabledSelections,
          length: maxPlayers - minDpsPlayers,
        },
      },
      {
        label: "min dps players",
        selectedSetting: minDpsPlayers,
        set: handleChangeMinDpsPlayers,
        variant: "rating",
        filter: {
          callback: genMaxDisabledSelections,
          length: maxPlayers - minSupportPlayers,
        },
      },
      {
        label: "sync swaps",
        selectedSetting: minDpsPlayers,
        set: handleChangeMinDpsPlayers,
        variant: "checkbox",
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
      syncSwaps,
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

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleDownloadClick = () => {
    if (!downloadLoading) {
      setLoadSuccess(false);
      setDownloadLoading(true);

      // fetch the data from the server and load it into the app
      timer.current = setTimeout(() => {
        setLoadSuccess(true);
        setDownloadLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

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
            {setting.variant === "rating" && (
              <RatingButtonGroup
                selected={setting.selectedSetting}
                disableSelections={setting.filter?.callback(
                  setting.filter.length
                )}
                onClick={(value) => {
                  setting.set(value);
                }}
              />
            )}
            {setting.variant === "checkbox" && (
              <Checkbox
                checked={syncSwaps}
                onChange={() => handleChangeSyncSwaps(!syncSwaps)}
                className="sync-swaps-checkbox settings-checkbox"
              />
            )}
          </div>
        ))}
      </div>
      <div className="settings-actions-container">
        <IconButton className="save-btn" onClick={handleSave}>
          <Save />
        </IconButton>
        <IconButton className="load-btn" component="label">
          <Folder />
          <input hidden type="file" onChange={handleLoad} />
        </IconButton>

        <IconButton className="download-btn" onClick={handleDownloadClick}>
          {loadSuccess ? <Check /> : <FileDownload />}
          {!loadSuccess && (
            <CircularProgress
              variant="determinate"
              value={100}
              className="download-progress"
            />
          )}
        </IconButton>
      </div>

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
  variant: "rating" | "checkbox";
  filter?: {
    callback: (length: number) => number[];
    length: number;
  };
};

export default Settings;
