import React, { useEffect, useState } from "react";
import MyMusicCard from "../components/MyMusic/MyMusicCard";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { redirect, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyMusic = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMySongs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/api/songs/my-songs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched Songs:", response.data);
        setSongs(response.data);
      } catch (err) {
        console.error("Error loading songs:", err); 
        toast.error("Failed to load songs");
      } finally {
        setLoading(false);
      }
    };

    fetchMySongs();
  }, []);

  return (
    <div>
      <h1 className="lg:text-3xl text-2xl font-extrabold ml-2 lg:mb-10 lg:m-3 mb-7">My Music</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {songs.length === 0 && !loading ? (
        <p>No songs uploaded yet.</p>
      ) : (
        songs.map((song) => <MyMusicCard key={song._id} song={song} />)
      )}
    </div>
  );
};

export default MyMusic;
