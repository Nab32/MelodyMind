import React from 'react';
import data from "../assets/data/songs.json"
import { Music, Play, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SongSelectPage = () => {
    const navigate = useNavigate();

    const handlePlayClick = (songId) => {
        navigate(`/play/${songId}`);
      };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Select Your Symphony</h1>
        <p className="text-xl">Choose a masterpiece to conduct</p>
      </div>

      {/* Songs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {data.songs.map((song, index) => (
          <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <h2 className="card-title text-2xl">{song.title}</h2>
              </div>
              
              <p className="text-lg opacity-90">{song.songName}</p>
              
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary" onClick={() => handlePlayClick(song.songId)}>
                  <Play size={16} className="mr-2" />
                  Play Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongSelectPage;