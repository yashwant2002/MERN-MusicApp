import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { usePlaylist } from "../store/PlaylistContext";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSongs } from "../store/SongContext";
import { PlayArrow } from "@mui/icons-material";

interface Song {
  _id: string;
  title: string;
  track : string;
  artist: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  thumbnail: string;
  genre: string;
  likes : number;
  duration: number;
}

interface GroupedSongs {
  [key: string]: Song[];
}

const Explore: React.FC = () => {
  const [groupedSongs, setGroupedSongs] = useState<GroupedSongs>({});
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { playSong } = useSongs();
  const { playlists, addSongToPlaylist } = usePlaylist();
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axiosInstance.get("/api/songs");
        const songs: Song[] = response.data;

        const grouped = songs.reduce((acc, song) => {
          if (!acc[song.genre]) {
            acc[song.genre] = [];
          }
          acc[song.genre].push(song);
          return acc;
        }, {} as GroupedSongs);

        setGroupedSongs(grouped);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    song: Song
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedSong(song);
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
    if (selectedSong) {
      await addSongToPlaylist(playlistId, selectedSong._id);
    }
    setDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="text-center text-white text-2xl mt-10">Loading...</div>
    );
  }

  const genres = ["All", ...Object.keys(groupedSongs)];

  const filteredSongs =
    selectedGenre && selectedGenre !== "All"
      ? { [selectedGenre]: groupedSongs[selectedGenre] }
      : groupedSongs;

  return (
    <div className="min-h-screen text-white p-8">
      <h1 className="text-3xl lg:text-4xl font-bold mb-8">Explore Music</h1>

      <div className="w-full overflow-x-auto">
        <div className="flex scroll-smooth  whitespace-nowrap px-4 py-2  gap-4 mb-8">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre === "All" ? null : genre)}
              className={`px-3 py-2 rounded-md transition-all duration-300 backdrop-blur-md ${
                (genre === "All" && !selectedGenre) || genre === selectedGenre
                  ? "bg-white text-black"
                  : "bg-gray-800 text-white"
              } hover:bg-white hover:text-black transition-colors`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-3">
        {Object.entries(filteredSongs).flatMap(([, songs]) =>
          songs.map((song) => (
            <div key={song._id} className="w-[160px] lg:w-[180px]">
              <div
                className="relative w-full h-[160px] lg:h-[180px] inline-block rounded-lg overflow-hidden cursor-pointer"
                onClick={() => playSong(song)}
              >
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex justify-center items-center">
                  <button className="text-white rounded-full bg-black p-2 hover:bg-gray-900 cursor-pointer">
                    <PlayArrow fontSize="large" />
                  </button>
                </div>
              </div>

              <div className="w-full text-white mt-2 flex justify-between items-center">
                <div>
                  <a className="font-bold block truncate">{song.title}</a>
                  <p className="text-sm truncate">
                    Artist:{" "}
                    <span
                      onClick={() => navigate(`/artist/${song.artist._id}`)}
                      className="text-gray-300 hover:underline cursor-pointer"
                    >
                      {song.artist.firstName + " " + song.artist.lastName}
                    </span>
                  </p>
                </div>

                <button
                  onClick={(e) => handleMenuOpen(e, song)}
                  className="text-white"
                >
                  <BsThreeDotsVertical size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenDialog}>Add to Playlist</MenuItem>
        <MenuItem>Like Song</MenuItem>
      </Menu>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle sx={{ backgroundColor: "#212121", color: "white" }}>
          Select a Playlist
        </DialogTitle>
        <List sx={{ backgroundColor: "#212121", color: "white" }}>
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

export default Explore;
