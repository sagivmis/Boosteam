import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import "./login.css";
import { useSettingsContext } from "../../providers/SettingsProvider/SettingsProvider";
import Back from "@mui/icons-material/ArrowBackRounded";
import { baseBackendUrl, sleep, ToastVariant } from "../../util";
import { useUtilContext } from "../../providers/UtilProvider";

const Login = () => {
  // add a state from app (router base) to see when the login was successful and the
  // ask to fetch the saved data or continue working
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState();

  const navigate = useNavigate();

  const { handleLogin } = useSettingsContext();
  const { handleOpenToast } = useUtilContext();

  const newToast = (newMessage: string, variant?: ToastVariant) => {
    handleOpenToast(newMessage, variant);
    setMessage(newMessage);
  };

  const handleLoginClick = async () => {
    setError(undefined);
    setMessage("");

    try {
      const response = await axios.post(`${baseBackendUrl}/login`, {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      handleLogin(username);
      newToast("Login successful", "success");
      await sleep(0.3);

      navigate("/"); // Redirect to home page after successful login
    } catch (error: any) {
      setError(error);
      console.error("Error logging in:", error);
      newToast("Failed to log in", "error");
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

        <button onClick={handleLoginClick}>Login</button>
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
