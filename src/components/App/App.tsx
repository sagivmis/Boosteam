import { useState } from "react";
import "./app.css";
import AllPlayers from "../AllPlayers";
import { flash } from "../../assets";
import { Button, createTheme, IconButton, ThemeProvider } from "@mui/material";
import clsx from "clsx";
import TeamRequirements from "../TeamRequirements";
import { Settings as SettingsIcon } from "@mui/icons-material";
import Settings from "../Settings";
import { SettingsProvider, PlayersProvider } from "../../providers";
import { usePlayersContext } from "../../providers/PlayersProvider/PlayersProvider";
import Teams from "../Teams";
import { useScreenshot } from "use-screenshot-hook";
import { copyImg } from "../../util";

const theme = createTheme({
  palette: {
    primary: { main: "#ffe478" },
    secondary: { main: "#ba68c8" },
    info: { main: "#2c3e50" },
    warning: { main: "#ef5350" },
  },
});

// in settings window allow to change:
//   - from alphabetical tiers to numerical
//   -
// also allow to add:
//   - support job (without adding specific jobs you can't
//                  use the required support req)

// also insert some of reqs in there like min and max players per teasm, min support\dps players,
function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <SettingsProvider>
        <PlayersProvider>
          <div className="app-container">
            <Settings open={isSettingsOpen} onClose={handleCloseSettings} />

            <Button className="settings-btn" onClick={handleOpenSettings}>
              <SettingsIcon />
            </Button>
            <div className="logo-container">
              <h3 className="logo">Boossteam</h3>
              <img src={flash} alt="flash" className="flash-icon" />
            </div>
            <div className="team-maker-container">
              {!isGenerating && <AllPlayers />}
              {/* <TeamRequirements /> */}
              <div
                onClick={() => {
                  setIsGenerating(true);
                }}
                className={clsx(
                  "generate-team-container players-input-small action--btn",
                  { clicked: isGenerating }
                )}
                style={{ cursor: isGenerating ? "default" : "pointer" }}
              >
                {isGenerating ? (
                  <>
                    <Teams />
                  </>
                ) : (
                  <img
                    src={flash}
                    alt="flash"
                    className="flash-icon-generate-btn"
                  />
                )}
              </div>
            </div>
          </div>
        </PlayersProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
