import React, { useState } from 'react';
import { IoPauseOutline, IoPlayOutline } from "react-icons/io5";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { useSongs } from '../../store/SongContext';
import DeleteDialog from './DeleteDialog';
import UpdateDialog from './UpdateDialog';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

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
    year: number;
    genre: string;
  };
}

const MyMusicCard: React.FC<SongProps> = ({ song }) => {
  const { currentSong, isPlaying, playSong, togglePlay, fetchSongs } = useSongs();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handlePlayPause = () => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/songs/${song._id}`);
      fetchSongs();
      setShowDeleteDialog(false);
      toast.success("Successfully Deleted Song")
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  return (
    <div className="w-full flex border-l-4 border-l-purple-700 border-solid justify-between hover:bg-purple-900/30 transition-all duration-300 rounded mb-3">
      <div className="flex items-center gap-3">
        <img src={song.thumbnail} alt={song.title} className="w-12 h-12 rounded-lg m-2" />
        <div>
          <h1 className="text-sm font-semibold">{song.title}</h1>
          <h2 className="text-xs text-gray-400">
            {song.artist?.firstName} {song.artist?.lastName}
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-5 mr-3">
        <button className=' cursor-pointer' onClick={handlePlayPause}>
          {currentSong?._id === song._id && isPlaying ? (
            <IoPauseOutline size={30} color="white" />
          ) : (
            <IoPlayOutline size={30} color="white" />
          )}
        </button>
        <button className=' cursor-pointer' onClick={() => setShowEditDialog(true)}>
          <MdEdit size={30} color="white" />
        </button>
        <button className=' cursor-pointer' onClick={() => setShowDeleteDialog(true)}>
          <MdDeleteOutline size={30} color="white" />
        </button>

        {/* Delete Dialog */}
        <DeleteDialog
          open={showDeleteDialog}
          handleClose={() => setShowDeleteDialog(false)}
          handleConfirm={handleDelete}
        />

        {/* Update Dialog */}
        <UpdateDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          song={song}
          onUpdateSuccess={fetchSongs}
        />
      </div>
    </div>
  );
};

export default MyMusicCard;
