import HomeCardRow from "../components/SongCard/HomeCardRow";
import { useSongs } from "../store/SongContext";

const Home = () => {
  const { songs, loading, error } = useSongs();

  if (loading) return <p className="text-center text-gray-400">Loading songs...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <HomeCardRow title="New Releases" songs={songs.slice(15, 30)} />
      <HomeCardRow title="Top Hits" songs={songs.slice(30, 45)} />
      <HomeCardRow title="Trending Now" songs={songs.slice(45, 60)} />
      <HomeCardRow title="Recommended For You" songs={songs.slice(0, 15)} />
    </div>
  );
};

export default Home;
