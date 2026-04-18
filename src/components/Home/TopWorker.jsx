import React, { useEffect, useState } from 'react';
import { Crown, Medal, Trophy, Coins, TrendingUp, Star, Loader } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const TopWorker = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopWorkers();
  }, []);

  const fetchTopWorkers = async () => {
    setLoading(true);
    try {

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/public/top-workers`);
      
      if (response.data.success) {
        setWorkers(response.data.workers);
      } else {
        setWorkers([]);
      }
    } catch (error) {
      console.error('Error fetching top workers:', error);
      toast.error('Failed to load top workers');
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <Crown size={20} className="text-yellow-500" />;
      case 1: return <Medal size={20} className="text-gray-400" />;
      case 2: return <Medal size={20} className="text-amber-600" />;
      default: return null;
    }
  };

  const getRankBadge = (index) => {
    if (index === 0) return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
    if (index === 1) return "bg-gray-400/20 text-gray-500 border-gray-400/30";
    if (index === 2) return "bg-amber-600/20 text-amber-600 border-amber-600/30";
    return "bg-base-300 text-base-content/50";
  };

  if (loading) {
    return (
      <section className="py-16 bg-base-100">
        <div className="container-modern">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-4">
              <Trophy size={14} className="text-primary" />
              <span className="text-primary font-medium text-sm">Top Performers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-3">
              Meet Our <span className="text-primary">Top Earners</span>
            </h2>
          </div>
          <div className="flex justify-center py-12">
            <div className="text-center">
              <Loader className="animate-spin mx-auto mb-3" size={40} />
              <p className="text-base-content/60">Loading top workers...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-base-100">
      <div className="container-modern">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            <Trophy size={14} className="text-primary" />
            <span className="text-primary font-medium text-sm">Top Performers</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-3">
            Meet Our{' '}
            <span className="text-primary">Top Earners</span>
          </h2>
          
          <p className="text-base-content/60 text-base">
            These workers have earned the most coins on our platform
          </p>
        </div>

        {/* Workers Grid */}
        {workers.length === 0 ? (
          <div className="text-center py-12 bg-base-200 rounded-xl">
            <Trophy size={48} className="mx-auto text-base-content/30 mb-3" />
            <p className="text-base-content/60">No workers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker, index) => (
              <div 
                key={worker._id} 
                className="group bg-base-200 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Rank Badge */}
                <div className="flex justify-between items-start mb-3">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRankBadge(index)}`}>
                    {getRankIcon(index)}
                    <span>#{index + 1}</span>
                  </div>
                  {index === 0 && (
                    <div className="text-yellow-500 animate-pulse">
                      <Star size={16} fill="currentColor" />
                    </div>
                  )}
                </div>

                {/* Avatar */}
                <div className="relative inline-block">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all">
                    <img
                      src={worker.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&background=3b82f6&color=fff&bold=true`}
                      alt={worker.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-1 right-2 w-3.5 h-3.5 bg-success rounded-full ring-2 ring-base-200"></div>
                </div>

                {/* Name */}
                <h3 className="text-lg font-semibold text-base-content mt-4 mb-2">
                  {worker.name}
                </h3>

                {/* Coins */}
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                  <Coins size={16} className="text-primary" />
                  <span className="text-primary font-bold">{worker.coins?.toLocaleString() || 0}</span>
                  <span className="text-xs text-base-content/50">coins</span>
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-4 mt-4 pt-3 border-t border-base-300">
                  <div className="text-center">
                    <div className="text-xs text-base-content/50">Tasks Done</div>
                    <div className="text-sm font-semibold text-base-content">
                      {Math.floor((worker.coins || 0) / 15)}+
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-base-content/50">Earnings</div>
                    <div className="text-sm font-semibold text-success">
                      ${Math.floor((worker.coins || 0) / 20)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-10">
          <button className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium">
            View All Workers <TrendingUp size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopWorker;