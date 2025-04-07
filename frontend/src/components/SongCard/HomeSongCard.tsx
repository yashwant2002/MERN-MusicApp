import { PlayArrow } from "@mui/icons-material";
import { useSongs } from "../../store/SongContext";
import { usePlaylist } from "../../store/PlaylistContext";
import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

interface SongProps {
  song: {
    _id: string;
    title: string;
    artist: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    thumbnail: string;
    track: string;
  };
}


const HomeSongCard: React.FC<SongProps> = ({ song }) => {
  const { playSong } = useSongs();
  const { playlists, addSongToPlaylist } = usePlaylist();
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likedInitialized, setLikedInitialized] = useState(false);

  // Optional: Fetch if this song is already liked (initial)
  useEffect(() => {
    const fetchLikedStatus = async () => {
      try {
        const { data } = await axiosInstance.get("/api/user/liked-songs");
        const isLiked = data.some((s: any) => s._id === song._id);
        setLiked(isLiked);
      } catch (err) {
        console.error("Failed to fetch liked songs",err);
      }
    };
    fetchLikedStatus();
  }, [song._id]);

  // Handle like/unlike
  const toggleLike = async () => {
    try {
      const url = liked ? "/api/user/unlike" : "/api/user/like";
      await axiosInstance.post(url, { songId: song._id });
      setLiked(!liked);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  useEffect(() => {
    const fetchLikedStatus = async () => {
      try {
        const { data } = await axiosInstance.get("/api/user/liked");
        const isLiked = data.some((s: any) => s._id === song._id);
        setLiked(isLiked);
      } catch (err) {
        console.error("Failed to fetch liked songs",err);
      } finally {
        setLikedInitialized(true);
      }
    };
    fetchLikedStatus();
  }, [song._id]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
    handleMenuClose();
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    await addSongToPlaylist(playlistId, song._id);
    setDialogOpen(false);
  };

  return (
    <div className="w-[160px] lg:w-[180px]">
      {/* Song Thumbnail */}
      <div
        className="relative w-full h-[160px] lg:h-[180px] inline-block rounded-lg overflow-hidden cursor-pointer m-2 group"
        onClick={() => playSong(song)}
      >
        <img
          src={song.thumbnail}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-all">
          <button className="text-white bg-black/70 p-2 rounded-full hover:bg-black">
            <PlayArrow fontSize="large" />
          </button>
        </div>
      </div>

      {/* Song Info + Actions */}
      <div className="w-full text-white mt-2 flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate">{song.title}</p>
          <p className="text-sm text-gray-300 truncate">
            Artist:{" "}
            <span
              onClick={() => navigate(`/artist/${song.artist._id}`)}
              className="hover:underline cursor-pointer"
            >
              {song.artist.firstName + " " + song.artist.lastName}
            </span>
          </p>
        </div>
          
          <button onClick={handleMenuOpen}>
            <BsThreeDotsVertical size={20} />
          </button>

      </div>

      {/* Options Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleOpenDialog}>Add to Playlist</MenuItem>
        <MenuItem onClick={toggleLike} disabled={!likedInitialized}>
        {!likedInitialized ? "Loading..." : liked ? "Unlike Song" : "Like Song"}
        </MenuItem>
      </Menu>

      {/* Playlist Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle sx={{ backgroundColor: "#212121", color: "white" }}>
          Select a Playlist
        </DialogTitle>
        <List sx={{ backgroundColor: "#212121", color: "white" }}>
          {playlists.length === 0 ? (
            <ListItem>
              <p className="text-gray-400">No playlists found</p>
            </ListItem>
          ) : (
            playlists.map((playlist) => (
              <ListItem key={playlist._id}>
                <ListItemButton onClick={() => handleAddToPlaylist(playlist._id)}>
                  {playlist.name}
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </Dialog>
    </div>
  );
};

export default HomeSongCard;
