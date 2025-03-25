import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, TextField } from "@mui/material";
import { CloudUpload, Close } from "@mui/icons-material";

const UploadMusicDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file || !title) {
      alert("Please select a file and enter a title.");
      return;
    }
    
    console.log("Uploading:", { title, file });
    
    // Handle upload logic (API call)
    
    onClose(); // Close dialog after upload
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Upload Music
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <TextField
          label="Music Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Button
          variant="contained"
          component="label"
          fullWidth
          startIcon={<CloudUpload />}
        >
          Select File
          <input type="file" accept="audio/*" hidden onChange={handleFileChange} />
        </Button>
        
        {file && <p style={{ marginTop: "10px" }}>Selected: {file.name}</p>}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUpload} color="primary" variant="contained" disabled={!file || !title}>
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadMusicDialog;
