import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { Button, TextField } from "@mui/material";
import Back from "@mui/icons-material/ArrowBackRounded";

import "./register.css";
import { useNavigate } from "react-router-dom";
import { useUtilContext } from "../../providers/UtilProvider";
import { baseBackendUrl, ToastVariant } from "../../util";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState();

  const navigate = useNavigate();
  const { handleOpenToast } = useUtilContext();

  const handleServerResponse = (newMessage: string, variant?: ToastVariant) => {
    handleOpenToast(newMessage, variant);
    setMessage(newMessage);
  };

  const handleRegister = async () => {
    setError(undefined);
    setMessage("");

    try {
      const response = await axios.post(`${baseBackendUrl}/register`, {
        username,
        password,
      });
      console.log(response.data.message);
      handleServerResponse("User registered successfully!", "success");
      navigate("/");
    } catch (error: any) {
      console.error("Error registering user:", error);
      setError(error);
      if (error.response.data.message) {
        handleServerResponse(error.response.data.message, "error");
      } else handleServerResponse("Failed to register user", "error");
    }
  };

  return (
    <div className="register-container">
      <Button
        className="header-btn back-btn"
        onClick={() => {
          navigate("/");
        }}
      >
        <Back />
      </Button>
      <h2>Register</h2>
      <div className="register">
        <div className="register-input-row">
          <h4 className="register-label">username</h4>
          <TextField
            classes={{ root: "register-input-container" }}
            slotProps={{ input: { className: "register-input" } }}
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="register-input-row">
          <h4 className="register-label">password</h4>
          <TextField
            classes={{ root: "register-input-container" }}
            slotProps={{ input: { className: "register-input" } }}
            type="password"
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button variant="contained" onClick={handleRegister}>
          Register
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

export default Register;
