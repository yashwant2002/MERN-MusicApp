import React, { useEffect, useState } from 'react'
import LikedSongList from './LikedSongList'
import axiosInstance from '../../utils/axiosInstance'

const LikedPlaylist = () => {
    const [likedSongs, setLikedSongs]= useState([])

    useEffect(()=>{
        const fetchLikedSong = async () =>{
            try {
                const response = await axiosInstance.get("/api/user/liked")
                setLikedSongs(response.data);
            } catch (error) {
                console.error("Error fetching liked songs:", err);
            }
        }

        fetchLikedSong();
    },[])
  return (
    <div className="w-full min-h-screen text-white ">
      <div className="p-4 md:p-8">
        <h1 className="text-3xl md:text-5xl font-bold">Liked Songs</h1>


        <div className="lg:mt-20 mt-10">
          <h1 className="mb-5 font-extrabold text-2xl">Songs</h1>
          <div>
            {
                likedSongs.length == 0?(
                    <p className="text-gray-400">You haven’t liked any songs yet.</p>
                ) : (
                    likedSongs.map((song:any)=>(
                        <LikedSongList song={song} key={song._id}
                        onDislike={(id) =>
                          setLikedSongs((prev) => prev.filter((s: any) => s._id !== id))
                        } />
                    ))
                )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default LikedPlaylist