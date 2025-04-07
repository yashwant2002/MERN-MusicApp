import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import { CloudUpload, Close } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";

const genres = ["Pop", "Rock", "Hip-Hop", "Classical", "Jazz", "EDM", "R&B", "Other"];

const UploadMusicDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const theme = useTheme(); 
  const [track, setTrack] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: "track" | "thumbnail") => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (type === "track" && file.type !== "audio/mpeg") {
        toast.error("Invalid file type! Only MP3 files are allowed.");
        return;
      }
      if (type === "thumbnail" && !["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Invalid file type! Only JPG and PNG images are allowed.");
        return;
      }
  
      if (type === "track") setTrack(file);
      if (type === "thumbnail") setThumbnail(file);
    }
  };

  const handleUpload = async () => {
    if (!track || !thumbnail || !title || !genre || !year) {
      toast.error("Please fill in all fields and select files.");
      return;
    }
  
    setLoading(true); // Start loading
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("year", year.toString());
    formData.append("genre", genre);
    formData.append("track", track);
    formData.append("thumbnail", thumbnail);
  
    try {
      await axiosInstance.post("/api/songs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Song uploaded successfully!");
      onClose();
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { backgroundColor: theme.palette.background.default, color: theme.palette.text.primary } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: theme.palette.background.paper }}>
        Upload Music
        <IconButton onClick={onClose} sx={{ color: theme.palette.text.primary }} disabled={loading}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Music Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2, bgcolor: theme.palette.background.paper, input: { color: theme.palette.text.primary } }}
          InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
          disabled={loading}
        />

        <TextField
          label="Year"
          type="number"
          fullWidth
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          sx={{ mb: 2, bgcolor: theme.palette.background.paper, input: { color: theme.palette.text.primary } }}
          InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
          inputProps={{ min: 1900, max: new Date().getFullYear() }}
          disabled={loading}
        />

        <TextField
          select
          label="Genre"
          fullWidth
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          sx={{ mb: 2, bgcolor: theme.palette.background.paper, input: { color: theme.palette.text.primary } }}
          InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
          disabled={loading}
        >
          {genres.map((g) => (
            <MenuItem key={g} value={g} sx={{ color: theme.palette.text.primary }}>
              {g}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          component="label"
          fullWidth
          startIcon={<CloudUpload />}
          sx={{ mb: 2, bgcolor: theme.palette.primary.dark, "&:hover": { bgcolor: theme.palette.primary.main } }}
          disabled={loading}
        >
          Select Track File
          <input type="file" accept="audio/*" hidden onChange={(e) => handleFileChange(e, "track")} />
        </Button>
        {track && <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Selected Track: {track.name}</Typography>}

        <Button
          variant="contained"
          component="label"
          fullWidth
          startIcon={<CloudUpload />}
          sx={{ mb: 2, bgcolor: theme.palette.primary.dark, "&:hover": { bgcolor: theme.palette.primary.main } }}
          disabled={loading}
        >
          Select Thumbnail
          <input type="file" accept="image/*" hidden onChange={(e) => handleFileChange(e, "thumbnail")} />
        </Button>
        {thumbnail && <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Selected Thumbnail: {thumbnail.name}</Typography>}
      </DialogContent>

      <DialogActions sx={{ bgcolor: theme.palette.background.paper }}>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleUpload} color="primary" variant="contained" disabled={loading || !track || !thumbnail || !title || !genre}>
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadMusicDialog;
