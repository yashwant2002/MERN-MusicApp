import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import Login from "./Login";
import Register from "./Register";
import Logo from "../../utils/Logo";

interface AuthDialogProps {
  open: boolean;
  handleClose: () => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, handleClose }) => {
  const [tab, setTab] = useState(0);

  return (
    <Dialog
  open={open}
  aria-hidden={false}
  onClose={handleClose}
  fullWidth
  maxWidth="xs"
  sx={{
    "& .MuiPaper-root": {
      backgroundColor: "#fff", 
      borderRadius: "12px", 
      padding: "20px",
      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)", 
    },
  }}
>
  <DialogTitle
    sx={{
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "20px",
      color: "#333",
    }}
  >
    <div className="flex justify-center">
      <img className="h-12 w-24" src="/AuthBlackLogo.png" />
    </div>
  </DialogTitle>

  {/* Tabs for switching between Login & Register */}
  <Tabs
    value={tab}
    onChange={(e, newValue) => setTab(newValue)}
    centered
    sx={{
      "& .MuiTabs-flexContainer": { justifyContent: "center" },
      "& .MuiTab-root": {
        textTransform: "none",
        fontSize: "16px",
        fontWeight: "bold",
        flexGrow: 1,
        transition: "all 0.3s ease-in-out",
        color: "#555", // Subtle color
        "&:hover": { color: "#1976d2" },
      },
      "& .Mui-selected": {
        color: "#1976d2 !important",
      },
      "& .MuiTabs-indicator": {
        backgroundColor: "#1976d2",
      },
    }}
  >
    <Tab label="Login" />
    <Tab label="Register" />
  </Tabs>

  {/* Dialog Content */}
  <DialogContent sx={{ position: "relative", padding: "20px" }}>
    {tab === 0 ? (
      <Login handleClose={handleClose} />
    ) : (
      <Register handleClose={handleClose} />
    )}
  </DialogContent>

  {/* Close Button */}
  <DialogActions>
    <Button
      sx={{
        position: "absolute",
        top: 10,
        right: 10,
        minWidth: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: "#eee", // Soft grey background
        color: "#333",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          backgroundColor: "#ddd",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        },
      }}
      onClick={handleClose}
    >
      <IoMdClose size={20} />
    </Button>
  </DialogActions>
</Dialog>


  );
};

export default AuthDialog;
