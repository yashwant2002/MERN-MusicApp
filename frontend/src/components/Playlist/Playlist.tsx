import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // To get playlist ID from URL
import { Box } from "@mui/material";
import { IoMdPlayCircle } from "react-icons/io";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import PlaylistMusicCard from "./PlaylistMusicCard";
import { AccountCircle } from "@mui/icons-material";
import { usePlaylist } from "../../store/PlaylistContext";
import { toast } from "react-toastify";

const Playlist = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { fetchPlaylistById, deletePlaylist } = usePlaylist(); 
  const [playlist, setPlaylist] = useState<any>(null); 
  // const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const getPlaylist = async () => {
      if (!id) return;
      // setLoading(true);
      const data = await fetchPlaylistById(id);
      setPlaylist(data);
      // setLoading(false);
    };
    getPlaylist();
  }, [id, fetchPlaylistById]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      try {
        await deletePlaylist(playlist._id);
        navigate("/")
        toast.success("Playlist deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete playlist:");
      }
    }
  };

  // if (loading) return <p className="text-center text-white">Loading...</p>;

  return (
    <div className="overflow-y-auto">
      <Box>
        <div className="lg:h-screen lg:w-1/3 lg:fixed lg:my-0 my-20 flex justify-center gap-9 items-center flex-col">
          <img
            className="h-[264px] w-[264px] rounded-sm"
            src={playlist?.thumbnail || "https://yt3.googleusercontent.com/wotexgHbeJJzumPdT8hUvTKElOEC24FPKO0sUMuQShht4B85voTd0o7KnR9o83FGXWwraCpbCZxq=s1200"}
            alt="Playlist Thumbnail"
          />
          <div className="flex flex-col justify-center items-center gap-3">
            <h1 className="text-2xl font-sans font-extrabold">{playlist?.name || "Unknown Playlist"}</h1>
            <p className="text-sm flex gap-2 items-center">
              <AccountCircle sx={{ color: "gray" }} />
              <span>{playlist?.owner?.firstName + " " + playlist?.owner?.lastName|| "Unknown Owner"}</span>
            </p>
            <div className="flex items-center justify-around w-[260px]">
              <button className="p-2 rounded-full bg-gray-600">
                <MdOutlineEdit size={25} />
              </button>
              <button>
                <IoMdPlayCircle size={70} />
              </button>
              <button onClick={handleDelete} className="p-2 rounded-full cursor-pointer bg-gray-600">
                <MdDeleteOutline size={25} />
              </button>
            </div>
          </div>
        </div>
      </Box>
      <div className="h-full">
        <div className="lg:mt-20 lg:ml-[40%]">
          {playlist?.songs && playlist.songs.length > 0 ? (
            playlist.songs.map((song: any, index: number) => (
              <PlaylistMusicCard key={index} playlistId={playlist._id} song={song} />
            ))
          ) : (
            <p className="text-center text-gray-400">No songs in this playlist</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
