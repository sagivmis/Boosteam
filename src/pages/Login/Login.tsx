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
  InputAdornment,
  InputBase,
  TextField,
  Tooltip,
} from "@mui/material";
import "./login.css";
import { useSettingsContext } from "../../providers/SettingsProvider/SettingsProvider";
import Back from "@mui/icons-material/ArrowBackRounded";
import { baseBackendUrl, LoginResponse, sleep, ToastVariant } from "../../util";
import { useUtilContext } from "../../providers/UtilProvider";
import { usePlayersContext } from "../../providers/PlayersProvider/PlayersProvider";
import { Close, Info } from "@mui/icons-material";
import clsx from "clsx";

const Login = () => {
  const navigate = useNavigate();

  const { handleLogin, user } = useSettingsContext();
  const { handleLoadTeams } = usePlayersContext();
  const { handleOpenToast } = useUtilContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState();

  const [isFetchModalOpen, setIsFetchModalOpen] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(false);
  // Validation states
  const [passwordError, setPasswordError] = useState<string>("");
  const [touched, setTouched] = useState({
    username: false,
    password: false,
  });

  const handleServerResponse = (newMessage: string, variant?: ToastVariant) => {
    handleOpenToast(newMessage, variant);
    setMessage(newMessage);
  };

  const handleLoginClick = async () => {
    setError(undefined);
    setMessage("");

    try {
      const response = await axios.post<LoginResponse>(
        `${baseBackendUrl}/api/auth/login`,
        {
          username,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      handleLogin(response.data.user);
      handleServerResponse("Login successful", "success");
      await sleep(0.3);

      if (response.data.user.players) {
        setIsFetchModalOpen(true);
      } else {
        navigate("/");
      }
    } catch (error: any) {
      setError(error);

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          handleServerResponse(
            "No Server Response, Please try again later",
            "error"
          );
        } else if (error.response.status === 401) {
          handleServerResponse("Incorrect Username / Password", "error");
        } else if (error.response.status === 500) {
          handleServerResponse("Server error", "error");
        }
      }

      console.error("Error logging in:", error);
      handleServerResponse("Failed to log in", "error");
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

  const validatePassword = (value: string): string => {
    if (value.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return "";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Only show errors if the field has been touched
    if (touched.password) {
      setPasswordError(validatePassword(newPassword));
    }
  };

  const handleCancelFetchProgress = () => {
    handleCloseFetchModal();
    navigate("/");
  };

  const handleBlur = (field: "username" | "password") => {
    setTouched({ ...touched, [field]: true });

    if (field === "password") {
      setPasswordError(validatePassword(password));
    }
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
        <div className={clsx("login-input-row")}>
          <h4 className="login-label">username</h4>
          <TextField
            classes={{ root: "login-input-container" }}
            slotProps={{ input: { className: "login-input" } }}
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            slots={{
              input: InputBase,
            }}
          />
        </div>
        <div className={clsx("login-input-row", { error: passwordError })}>
          <h4 className="login-label">password</h4>
          <TextField
            classes={{ root: "login-input-container" }}
            slotProps={{
              input: {
                className: "login-input",
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title="Password must be at least 8 characters long"
                      arrow
                    >
                      <IconButton
                        edge="end"
                        size="small"
                        color={passwordError ? "error" : "default"}
                      >
                        <Info fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              },
            }}
            type="password"
            variant="standard"
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => handleBlur("password")}
            error={touched.password && !!passwordError}
            fullWidth
            slots={{
              input: InputBase,
            }}
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
