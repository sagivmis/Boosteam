import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import "./login.css";
import { useSettingsContext } from "../../providers/SettingsProvider/SettingsProvider";
import Back from "@mui/icons-material/ArrowBackRounded";
import { baseBackendUrl, LoginResponse, sleep, ToastVariant } from "../../util";
import { useUtilContext } from "../../providers/UtilProvider";
import { usePlayersContext } from "../../providers/PlayersProvider/PlayersProvider";
import { Close } from "@mui/icons-material";

const Login = () => {
  // after login ask if to fetch data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState();

  const [isFetchModalOpen, setIsFetchModalOpen] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(false);

  const navigate = useNavigate();

  const { handleLogin, user } = useSettingsContext();
  const { handleLoadTeams } = usePlayersContext();
  const { handleOpenToast } = useUtilContext();

  const newToast = (newMessage: string, variant?: ToastVariant) => {
    handleOpenToast(newMessage, variant);
    setMessage(newMessage);
  };

  const handleLoginClick = async () => {
    setError(undefined);
    setMessage("");

    try {
      const response = await axios.post<LoginResponse>(
        `${baseBackendUrl}/login`,
        {
          username,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      handleLogin(response.data.user);
      newToast("Login successful", "success");
      await sleep(0.3);

      if (response.data.user.players) {
        setIsFetchModalOpen(true);
      } else {
        navigate("/");
      }
    } catch (error: any) {
      setError(error);
      console.error("Error logging in:", error);
      newToast("Failed to log in", "error");
    }
  };

  const handleCloseFetchModal = () => {
    setIsFetchModalOpen(false);
  };

  const handleFetchProgress = () => {
    if (user && user.players && user.teams) {
      handleLoadTeams(user.players, user.teams);

      navigate("/");
    }
  };

  const handleCancelFetchProgress = () => {
    handleCloseFetchModal();
    navigate("/");
  };
  return (
    <div className="login-container">
      <Button
        className="header-btn back-btn"
        onClick={() => {
          navigate("/");
        }}
      >
        <Back />
      </Button>

      <Dialog
        classes={{ paper: "fetch-modal-paper-container" }}
        open={isFetchModalOpen}
        onClose={handleCloseFetchModal}
      >
        <DialogTitle>{"Use saved progress?"}</DialogTitle>
        <DialogContent className="fetch-modal-content-container">
          <DialogContentText className="fetch-modal-text-container">
            Would you like to fetch your saved progress from the server?
            <span className="bold small-text">
              NOTE: This will overwrite your current work
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleCancelFetchProgress}>
            <Close />
          </IconButton>
          <Button onClick={handleFetchProgress} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <h2>Login</h2>
      <div className="login">
        <div className="login-input-row">
          <h4 className="login-label">username</h4>
          <TextField
            classes={{ root: "login-input-container" }}
            slotProps={{ input: { className: "login-input" } }}
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="login-input-row">
          <h4 className="login-label">password</h4>
          <TextField
            classes={{ root: "login-input-container" }}
            slotProps={{ input: { className: "login-input" } }}
            variant="standard"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button variant="contained" onClick={handleLoginClick}>
          Login
        </Button>
      </div>
      <div className="response-message-container">
        {message && (
          <span className={`${error ? "error" : "success"}-message`}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
};

export default Login;
