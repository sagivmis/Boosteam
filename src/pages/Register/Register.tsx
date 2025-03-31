import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import {
  Button,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputBase,
  TextField,
  Tooltip,
} from "@mui/material";
import Back from "@mui/icons-material/ArrowBackRounded";

import "./register.css";
import { useNavigate } from "react-router-dom";
import { useUtilContext } from "../../providers/UtilProvider";
import { baseBackendUrl, ToastVariant } from "../../util";
import { Info, Error } from "@mui/icons-material";
import clsx from "clsx";

const Register = () => {
  const navigate = useNavigate();
  const { handleOpenToast } = useUtilContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<Error>();

  // Validation states
  const [passwordError, setPasswordError] = useState<string>("");
  const [touched, setTouched] = useState({
    username: false,
    password: false,
  });

  // Password validation function
  const validatePassword = (value: string): string => {
    if (value.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return "";
  };

  // Handle field blur event
  const handleBlur = (field: "username" | "password") => {
    setTouched({ ...touched, [field]: true });

    if (field === "password") {
      setPasswordError(validatePassword(password));
    }
  };

  const handleServerResponse = (newMessage: string, variant?: ToastVariant) => {
    handleOpenToast(newMessage, variant);
    setMessage(newMessage);
  };

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Only show errors if the field has been touched
    if (touched.password) {
      setPasswordError(validatePassword(newPassword));
    }
  };

  const handleRegister = async () => {
    setError(undefined);
    setMessage("");

    try {
      const response = await axios.post(`${baseBackendUrl}/register`, {
        username,
        password,
      });

      handleServerResponse("User registered successfully!", "success");
      navigate("/");
    } catch (error: any) {
      console.error("Error registering user:", error);
      setError(error as Error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          handleServerResponse(
            "No Server Response, Please try again later",
            "error"
          );
        } else if (error.response.status === 400) {
          handleServerResponse("Incorrect Username / Password");
        } else if (error.response.status === 401) {
          handleServerResponse("Unauthorized");
        }
      }

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
            onBlur={() => handleBlur("username")}
            onChange={(e) => setUsername(e.target.value)}
            slots={{
              input: InputBase,
            }}
          />
        </div>
        <div className={clsx("register-input-row", { error: passwordError })}>
          <h4 className="register-label">password</h4>
          <TextField
            classes={{ root: "register-input-container" }}
            slotProps={{
              input: {
                className: "register-input",
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
          {/* {touched.password && passwordError && (
            <FormHelperText error className="password-error">
              <Error
                fontSize="small"
                style={{ verticalAlign: "middle", marginRight: "4px" }}
              />
              {passwordError}
            </FormHelperText>
          )} */}
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
