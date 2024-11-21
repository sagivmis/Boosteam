import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import "./login.css";
import { useSettingsContext } from "../../providers/SettingsProvider/SettingsProvider";
import Back from "@mui/icons-material/ArrowBackRounded";

const Login = () => {
  // add a state from app (router base) to see when the login was successful and the
  // ask to fetch the saved data or continue working
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { handleLogin } = useSettingsContext();

  const handleLoginClick = async () => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      handleLogin(username);
      console.log("Login successful");
      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      console.error("Error logging in:", error);
      console.log("Failed to log in");
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
    </div>
  );
};

export default Login;
