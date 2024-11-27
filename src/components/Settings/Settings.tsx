import {
  Box,
  Checkbox,
  CircularProgress,
  Dialog,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import "./settings.css";
import {
  baseBackendUrl,
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
import axios from "axios";
import Cloud from "@mui/icons-material/CloudQueue";
import Refresh from "@mui/icons-material/Refresh";
import { useUtilContext } from "../../providers/UtilProvider";
import More from "@mui/icons-material/MoreVert";
import { Close } from "@mui/icons-material";
import clsx from "clsx";
import InformationTooltip from "../../util/components/InformationTooltip";

interface ISettings {
  open: boolean;
  onClose: () => void;
}

const Settings = (props: ISettings) => {
  const { open, onClose } = props;
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [loadSuccess, setLoadSuccess] = useState(false);
  const [error, setError] = useState<any>();
  const [extraMenuAnchorEl, setExtraMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const extraMenuOpen = Boolean(extraMenuAnchorEl);

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
  const { handleOpenToast } = useUtilContext();

  const handleOpenExtraMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExtraMenuAnchorEl(event.currentTarget);
  };
  const handleCloseExtraMenu = () => {
    setExtraMenuAnchorEl(null);
  };

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
        info: ["Maximum players allowed in a single team"],
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
        info: ["Minimum Support players required for a single team"],
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
        info: ["Minimum DPS players required for a single team"],
      },
      {
        label: "sync swaps",
        selectedSetting: minDpsPlayers,
        set: handleChangeMinDpsPlayers,
        variant: "checkbox",
        info: [
          "If enabled, will consider the swaps while keeping team requirements",
          "If disabled, will fill the teams only after the swapped players are assigned",
        ],
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
    handleCloseExtraMenu();
  };

  const loadProgressFromServer = async () => {
    setError(undefined);
    const token = localStorage.getItem("token");
    if (!token) {
      setError({ message: "Please log in to load progress" });
      handleOpenToast("Please log in to load progress", "error");
      return;
    }

    try {
      const response = await axios.get(`${baseBackendUrl}/load-progress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const {
        players: loadedPlayers,
        teams: loadedTeams,
        settings: loadedSettings,
      } = response.data;

      handleLoadTeams(loadedPlayers, loadedTeams);
      handleLoadSettings(loadedSettings);
    } catch (error) {
      console.error("Error loading progress:", error);
      handleOpenToast("Failed to load progress", "error");
    }
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadTeamsFromFile(file, (data) => {
        handleLoadTeams(data.players, data.teams);
        handleLoadSettings(data.settings);
        onClose();
      });
    }

    handleCloseExtraMenu();
  };

  const totalTeams = useMemo(
    () => players.length / maxPlayers,
    [players, maxPlayers]
  );

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleDownloadClick = () => {
    setLoadSuccess(false);
    setDownloadLoading(true);

    loadProgressFromServer().then(() => {
      setLoadSuccess(true);
      setDownloadLoading(false);
    });
  };

  const handleSaveToServer = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleOpenToast("Please log in to save progress", "error");
      return;
    }

    try {
      await axios.post(
        `${baseBackendUrl}/save-progress`,
        {
          players,
          teams,
          settings: { maxPlayers, minDpsPlayers, minSupportPlayers, syncSwaps },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleOpenToast("Progress saved to server successfully", "success");
    } catch (error) {
      console.error("Error saving progress:", error);
      handleOpenToast("Failed to save progress", "error");
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
            <div className="setting-title-container">
              <h4 className="setting-title">{setting.label}</h4>
              <InformationTooltip info={setting.info} />
            </div>
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
        <Menu
          id="basic-menu"
          anchorEl={extraMenuAnchorEl}
          open={extraMenuOpen}
          onClose={handleCloseExtraMenu}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleSave} className="menu-row">
            <span className="menu-row-label">Save as...</span>
            <FileDownload className="menu-icon" />
          </MenuItem>
          <MenuItem className="menu-row">
            <input hidden id="file-upload" type="file" onChange={handleLoad} />
            <label htmlFor="file-upload" className="menu-row-label">
              <span className="menu-row-label">Load</span>
              <Folder className="menu-icon" />
            </label>
          </MenuItem>
        </Menu>
        <IconButton className="save-btn" onClick={handleOpenExtraMenu}>
          <Tooltip title="MENU" classes={{ tooltip: "tooltip-container" }}>
            <More />
          </Tooltip>
        </IconButton>
        <IconButton className="save-btn" onClick={handleSaveToServer}>
          <Tooltip title="SAVE" classes={{ tooltip: "tooltip-container" }}>
            <Save />
          </Tooltip>
        </IconButton>

        <Tooltip title="LOAD" classes={{ tooltip: "tooltip-container" }}>
          <IconButton
            className={clsx("download-btn", { error })}
            onClick={handleDownloadClick}
          >
            {error ? (
              <Close className="download-error-icon" />
            ) : loadSuccess ? (
              <Check />
            ) : (
              <Cloud />
            )}
            {!error && (
              <CircularProgress
                variant="determinate"
                value={loadSuccess ? 100 : 0}
                className="download-progress"
              />
            )}
          </IconButton>
        </Tooltip>
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
  info: string[];
};

export default Settings;
