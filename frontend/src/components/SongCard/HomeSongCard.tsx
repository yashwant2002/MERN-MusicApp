import { PlayArrow } from "@mui/icons-material";
import { useSongs } from "../../store/SongContext";
import { usePlaylist } from "../../store/PlaylistContext";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { Menu, MenuItem, Dialog, DialogTitle, List, ListItem, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

  // Open menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };
  // Close menu
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Open playlist selection dialog
  const handleOpenDialog = () => {
    setDialogOpen(true);
    handleMenuClose();
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Add song to selected playlist
  const handleAddToPlaylist = async (playlistId: string) => {
    await addSongToPlaylist(playlistId, song._id);
    setDialogOpen(false);
  };

  return (
    <div className="w-[160px] lg:w-[180px]">
      {/* Song Thumbnail & Play Button */}
      <div
        className="relative w-full h-[160px] lg:h-[180px] inline-block rounded-lg overflow-hidden cursor-pointer m-2"
        onClick={() => playSong(song)} 
      >
        <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex justify-center items-center">
          <button className="text-white rounded-full bg-black p-2 hover:bg-gray-900 cursor-pointer">
            <PlayArrow fontSize="large" />
          </button>
        </div>
      </div>

      {/* Song Details */}
      <div className="w-full text-white mt-2 flex justify-between items-center">
        <div>
          <a className="font-bold block truncate">{song.title}</a>
          <p className="text-sm truncate">
            Artist: <span onClick={()=> navigate(`/artist/${song.artist._id}`)} className="text-gray-300 hover:underline cursor-pointer">{song.artist.firstName + " " + song.artist.lastName}</span>
          </p>
        </div>

        {/* Options Menu */}
        <button onClick={handleMenuOpen} className="text-white">
          <BsThreeDotsVertical size={20} />
        </button>
      </div>

      {/* MUI Menu */}
      <Menu  anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleOpenDialog}>Add to Playlist</MenuItem>
        <MenuItem>Like Song</MenuItem>
      </Menu>

      {/* Playlist Selection Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle sx={{backgroundColor:"#212121" , color:"white"}}>Select a Playlist</DialogTitle>
        <List sx={{backgroundColor:"#212121" , color:"white"}}>
          {playlists.map((playlist) => (
            <ListItem key={playlist._id}>
              <ListItemButton onClick={() => handleAddToPlaylist(playlist._id)}>
                {playlist.name}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>
    </div>
  );
};

export default HomeSongCard;
