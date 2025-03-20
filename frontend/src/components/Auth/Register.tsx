import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

interface RegisterProps {
  handleClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ handleClose }) => {
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!registerData.name || !registerData.email || !registerData.password) {
      alert("All fields are required.");
      return;
    }
    alert("Registering...");
    handleClose();
  };

  return (
    <>
      <TextField
        margin="dense"
        label="First Name"
        name="name"
        type="text"
        fullWidth
        required
        value={registerData.name}
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
      <TextField
        margin="dense"
        label="Last Name"
        name="name"
        type="text"
        fullWidth
        required
        value={registerData.name}
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
      <TextField
        margin="dense"
        label="Email"
        name="email"
        type="email"
        fullWidth
        required
        value={registerData.email}
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
      <TextField
        margin="dense"
        label="Password"
        name="password"
        type="password"
        fullWidth
        required
        value={registerData.password}
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
      <Button onClick={handleSubmit} color="primary" variant="contained" fullWidth sx={{
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
  }}>
        Register
      </Button>
    </>
  );
};

export default Register;
