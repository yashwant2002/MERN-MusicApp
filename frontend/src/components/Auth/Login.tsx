import React, { useState } from "react";
import { TextField, Button, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../store/AuthContext";

interface LoginProps {
  handleClose: () => void;
}

const Login: React.FC<LoginProps> = ({ handleClose }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.warn("⚠️ Please enter both email and password.");
      return;
    }

    try {
      await login(loginData.email, loginData.password);
      
      toast.success("🎉 Login successful!");
      
      handleClose();
    } catch (error) {
      toast.error("❌ Invalid email or password. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        margin="dense"
        label="Email"
        name="email"
        type="email"
        fullWidth
        required
        value={loginData.email}
        onChange={handleChange}
        error={!!error}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            "& fieldset": { borderColor: error ? "red" : "grey" },
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
        type={showPassword ? "text" : "password"}
        fullWidth
        required
        value={loginData.password}
        onChange={handleChange}
        error={!!error}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            "& fieldset": { borderColor: error ? "red" : "grey" },
            "&:hover fieldset": { borderColor: "#1976d2" },
            "&.Mui-focused fieldset": { borderColor: "#1976d2" },
          },
          "& .MuiInputLabel-root": { color: "black" },
        }}
      />

      <Button
        type="submit"
        color="primary"
        variant="contained"
        fullWidth
        sx={{
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
        }}
      >
        Login
      </Button>
    </form>
  );
};

export default Login;
