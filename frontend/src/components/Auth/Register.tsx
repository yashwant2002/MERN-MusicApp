import React, { useState } from "react";
import { TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../store/AuthContext";

interface RegisterProps {
  handleClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ handleClose }) => {
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.password) {
      setError("All fields are required.");
      return;
    }
    console.log("Registering user with data:", registerData);
    try {
      await register(registerData.firstName, registerData.lastName, registerData.email, registerData.password);
      handleClose();
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        margin="dense"
        label="First Name"
        name="firstName"
        type="text"
        fullWidth
        required
        value={registerData.firstName}
        onChange={handleChange}
        sx={inputStyles}
      />
      <TextField
        margin="dense"
        label="Last Name"
        name="lastName"
        type="text"
        fullWidth
        required
        value={registerData.lastName}
        onChange={handleChange}
        sx={inputStyles}
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
        sx={inputStyles}
      />
      <TextField
        margin="dense"
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        fullWidth
        required
        value={registerData.password}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={inputStyles}
      />

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <Button
        type="submit"
        color="primary"
        variant="contained"
        fullWidth
        sx={buttonStyles}
      >
        Register
      </Button>
    </form>
  );
};

const inputStyles = {
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
};

const buttonStyles = {
  mt: 2,
  background: "rgba(25, 118, 210, 0.8)",
  backdropFilter: "blur(10px)",
  borderRadius: "12px",
  fontWeight: "bold",
  textTransform: "none",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    background: "rgba(25, 118, 210, 1)",
    boxShadow: "0px 4px 15px rgba(25, 118, 210, 0.3)",
  },
};

export default Register;
