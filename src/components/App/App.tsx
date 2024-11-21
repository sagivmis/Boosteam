import { useState } from "react";
import "./app.css";
import AllPlayers from "../AllPlayers";
import { flash } from "../../assets";
import { Button, createTheme, ThemeProvider } from "@mui/material";
import clsx from "clsx";
import { Settings as SettingsIcon } from "@mui/icons-material";
import Settings from "../Settings";
import { SettingsProvider, PlayersProvider } from "../../providers";
import Teams from "../Teams";
import Back from "@mui/icons-material/ArrowBackRounded";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "../../pages/Login/Login";
import Register from "../../pages/Register/Register";
import { useSettingsContext } from "../../providers/SettingsProvider/SettingsProvider";

const theme = createTheme({
  palette: {
    primary: { main: "#5a7087" },
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
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <SettingsProvider>
          <PlayersProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </PlayersProvider>
        </SettingsProvider>
      </ThemeProvider>
    </Router>
  );
}

const Home = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { loggedIn, username } = useSettingsContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleStopGenerating = () => setIsGenerating(false);

  console.log(location);
  return (
    <div className="app-container">
      <Settings open={isSettingsOpen} onClose={handleCloseSettings} />

      <Button className="header-btn settings-btn" onClick={handleOpenSettings}>
        <SettingsIcon />
      </Button>
      <div className="logo-container">
        <h3 className="logo">Boossteam</h3>
        <img src={flash} alt="flash" className="flash-icon" />
      </div>
      <div className="team-maker-container">
        {loggedIn && <h2 className="greeting-header">Hello {username}</h2>}

        {!loggedIn && (
          <div className="login-register-container">
            <Button
              className="login-btn"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </Button>
            <Button
              className="register-btn"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </Button>
          </div>
        )}

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
            <img src={flash} alt="flash" className="flash-icon-generate-btn" />
          )}
        </div>
      </div>
    </div>
  );
};
export default App;
