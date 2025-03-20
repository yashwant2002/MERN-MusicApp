import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

interface LoginProps {
  handleClose: () => void;
}

const Login: React.FC<LoginProps> = ({ handleClose }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!loginData.email || !loginData.password) {
      alert("Please enter both email and password.");
      return;
    }
    alert("Logging in...");
    handleClose();
  };

  return (
    <>
      <TextField
  margin="dense"
  label="Email"
  name="email"
  type="email"
  fullWidth
  required
  value={loginData.email}
  onChange={handleChange}
  sx={{
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Light frosted effect
    borderRadius: "8px",
    "& .MuiOutlinedInput-root": {
      backdropFilter: "blur(10px)", // Glassmorphic effect
      borderRadius: "12px",
      "& fieldset": { borderColor: "grey" },
      "&:hover fieldset": { borderColor: "#1976d2" },
      "&.Mui-focused fieldset": { borderColor: "#1976d2" },
    },
    "& .MuiInputLabel-root": { color: "black" },
  }}
/>

<TextField
  margin="dense"
  label="Password"
  name="password"
  type="password"
  fullWidth
  required
  value={loginData.password}
  onChange={handleChange}
  sx={{
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    "& .MuiOutlinedInput-root": {
      backdropFilter: "blur(10px)",
      borderRadius: "12px",
      "& fieldset": { borderColor: "grey" },
      "&:hover fieldset": { borderColor: "#1976d2" },
      "&.Mui-focused fieldset": { borderColor: "#1976d2" },
    },
    "& .MuiInputLabel-root": { color: "black" },
  }}
/>

<Button
  onClick={handleSubmit}
  color="primary"
  variant="contained"
  fullWidth
  sx={{
    mt: 2,
    background: "rgba(25, 118, 210, 0.8)", // Glassy blue effect
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    fontWeight: "bold",
    textTransform: "none",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      background: "rgba(25, 118, 210, 1)",
      boxShadow: "0px 4px 15px rgba(25, 118, 210, 0.3)",
    },
  }}
>
  Login
</Button>

    </>
  );
};

export default Login;
