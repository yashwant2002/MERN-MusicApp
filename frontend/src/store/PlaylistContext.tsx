import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosInstance from "../utils/axiosInstance";

// Define Playlist Type
interface Playlist {
  _id: string;
  name: string;
  thumbnail: string;
  owner: { _id: string; firstName: string;  lastName: string; };
  songs: any[];
}

interface PlaylistContextType {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
  fetchPlaylists: () => Promise<void>;
  fetchPlaylistById: (id: string) => Promise<Playlist | null>;
  createPlaylist: (name: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
}

// Create Context
const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all user playlists
  const fetchPlaylists = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem("token"); 
      const response = await axiosInstance.get("/api/playlist/my-playlists",{
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaylists(response.data);
      // console.log(response.data)
    } catch (err) {
      setError("Failed to load playlists.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single playlist by ID
  const fetchPlaylistById = async (id: string): Promise<Playlist | null> => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/playlist/${id}`);
      return response.data;
    } catch (err) {
      setError("Failed to load playlist.");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new playlist
  const createPlaylist = async (name: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/playlist/create", { name });
      setPlaylists([...playlists, response.data]);
      setError("Failed to create playlist.");
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a playlist
  const deletePlaylist = async (id: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/api/playlist/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlaylists((prevPlaylists) => prevPlaylists.filter((playlist) => playlist._id !== id));
    } catch (err) {
      setError("Failed to delete playlist.");
      console.error("Error deleting playlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const addSongToPlaylist = async (playlistId: string, songId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post(
        "/api/playlist/add-song",
        { playlistId, songId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (!response.data || !response.data.songs) {
        console.error("Error: Playlist data is missing from the response");
        return;
      }
  
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          playlist._id === playlistId ? { ...playlist, songs: response.data.songs } : playlist
        )
      );
    } catch (err) {
      setError("Failed to add song.");
      console.error("Add song error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
    try {
  
      await axiosInstance.delete(`/api/playlist/${playlistId}/songs/${songId}`);

      setPlaylists((prev) =>
        prev.map((playlist) =>
          playlist._id === playlistId
            ? { ...playlist, songs: playlist.songs.filter(song => song._id !== songId) }
            : playlist
        )
      );
      
    } catch (error) {
      console.error("Failed to remove song:", error);
    }
  };
  
  
  
  useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <PlaylistContext.Provider
      value={{ playlists, loading, error, fetchPlaylists, fetchPlaylistById, createPlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylist must be used within a PlaylistProvider");
  }
  return context;
};
