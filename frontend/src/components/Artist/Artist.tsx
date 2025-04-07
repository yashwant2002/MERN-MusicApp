import ArtistSongCard from './ArtistSongCard';

const Artist = () => {
  return (
    <div className="w-full min-h-screen text-white ">
      <div className="p-4 md:p-8">
        <h1 className="text-3xl md:text-5xl font-bold">Artist Name</h1>

        <div className="my-4">
          <button className="border bg-gray-300 text-black rounded-full cursor-pointer border-gray-300 py-2 px-5">
            Play
          </button>
        </div>

        <div className="lg:mt-20 mt-10">
          <h1 className="mb-5 font-extrabold text-2xl">Songs</h1>
          <div>
            {[...Array(20)].map((_, index) => (
              <ArtistSongCard  key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artist;
