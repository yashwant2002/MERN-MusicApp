import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

interface CreatePlaylistProps {
  open: boolean;
  handleClose: () => void;
}

const CreatePlaylist: React.FC<CreatePlaylistProps> = ({
  open,
  handleClose,
}) => {
  const [playlistName, setPlaylistName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const DEFAULT = "https://yt3.googleusercontent.com/wotexgHbeJJzumPdT8hUvTKElOEC24FPKO0sUMuQShht4B85voTd0o7KnR9o83FGXWwraCpbCZxq=s1200";

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      setError("Playlist name is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
    //   console.log("Token from Local Storage:", localStorage.getItem("token"));
      const response = await axiosInstance.post(
        "/api/playlist/create",
        { name: playlistName, },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Playlist Created:", response.data);
      handleClose();
      setPlaylistName("");
      window.location.reload()
      toast.success("Playlist Successfully Created!");
    } catch (error) {
      toast.error("Failed to Create Playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "12px",
          padding: "20px",
          backgroundColor: "#212121",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", color: "white" }}>
        Create New Playlist
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Playlist Name"
          variant="filled"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          sx={{
            mb: 2,
            input: { color: "white" },
            label: { color: "white" },
            "& .MuiInputLabel-root": { color: "white" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" },
            "& .MuiFilledInput-root": {
              backgroundColor: "#333",
            },
          }}
        />
        <TextField
          fullWidth
          label="Description (Optional)"
          multiline
          rows={3}
          variant="filled"
          sx={{
            input: { color: "white" },
            label: { color: "white" },
            "& .MuiInputLabel-root": { color: "white" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" },
            "& .MuiFilledInput-root": {
              backgroundColor: "#333",
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} sx={{ color: "white" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: "white",
            color: "black",
            fontWeight: "500",
            borderRadius: "50px",
          }}
          onClick={handleCreatePlaylist}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePlaylist;
