import React, { useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import Back from "@mui/icons-material/ArrowBackRounded";

import "./register.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3000/register", {
        username,
        password,
      });
      console.log(response.data.message);
      alert("User registered successfully!");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register user");
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

        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default Register;
