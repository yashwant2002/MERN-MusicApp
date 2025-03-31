import { useEffect, useState } from "react";
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

interface Song {
  _id: string;
  title: string;
  year: number;
  genre: string;
  thumbnail: string;
}

interface UpdateDialogProps {
  open: boolean;
  onClose: () => void;
  song?: Song; // Make `song` optional to prevent undefined errors
  onUpdateSuccess: () => void;
}

const UpdateDialog: React.FC<UpdateDialogProps> = ({ open, onClose, song, onUpdateSuccess }) => {
  const theme = useTheme();
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [genre, setGenre] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Set song details when `song` is available
  useEffect(() => {
    if (song) {
      setTitle(song.title);
      setYear(song.year);
      setGenre(song.genre);
    }
  }, [song]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Invalid file type! Only JPG and PNG images are allowed.");
        return;
      }
      setThumbnail(file);
    }
  };

  const handleUpdate = async () => {
    if (!title || !genre || !year) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("year", year.toString());
      formData.append("genre", genre);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      await axiosInstance.put(`/api/songs/${song?._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Song updated successfully!");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      toast.error("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!song) return null; // Prevent rendering if `song` is undefined

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { backgroundColor: theme.palette.background.default, color: theme.palette.text.primary } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: theme.palette.background.paper }}>
        Update Song
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
          Change Thumbnail
          <input type="file" accept="image/*" hidden onChange={handleFileChange} />
        </Button>
        {thumbnail && <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Selected Thumbnail: {thumbnail.name}</Typography>}
      </DialogContent>

      <DialogActions sx={{ bgcolor: theme.palette.background.paper }}>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="primary" variant="contained" disabled={loading || !title || !genre || !year}>
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDialog;
