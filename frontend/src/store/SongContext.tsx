import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { AxiosError } from "axios"; // Import AxiosError for better type checking

interface Song {
  _id: string;
  title: string;
  artist: string;
  thumbnail: string;
  track: string;
  likes: number;
}

interface SongContextType {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  loading: boolean;
  error: string | null;
  fetchSongs: () => Promise<void>;
  playSong: (song: Song) => void;
  togglePlay: () => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

export const SongProvider = ({ children }: { children: ReactNode }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<Song[]>("/api/songs");
      setSongs(response.data);
      setError(null);

      if (currentSong && !response.data.some(song => song._id === currentSong._id)) {
        setCurrentSong(response.data.length > 0 ? response.data[0] : null);
      } else if (!currentSong && response.data.length > 0) {
        setCurrentSong(response.data[0]);
      }
    } catch (err) {
      console.error("Error fetching songs:", err);
      let errorMessage = "Failed to load songs. Please try again.";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentSong]); // Include currentSong as a dependency

  const playSong = (song: Song) => {
    // Only update if it's a new song
    if (currentSong?._id !== song._id) {
      setCurrentSong(song);
      setIsPlaying(true);
    } else {
      // Toggle play if the same song is clicked
      setIsPlaying(prev => !prev);
    }
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]); // Add fetchSongs as a dependency

  return (
    <SongContext.Provider
      value={{ songs, currentSong, isPlaying, loading, error, fetchSongs, playSong, togglePlay }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const useSongs = (): SongContextType => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("useSongs must be used within a SongProvider");
  }
  return context;
};