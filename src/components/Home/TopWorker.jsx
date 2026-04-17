import React from 'react';
import { Crown, Medal, Trophy, Coins, TrendingUp, Star } from 'lucide-react';

const TopWorker = () => {
  const workers = [
    { _id: 1, name: "Sarah Johnson", photoURL: "https://randomuser.me/api/portraits/women/1.jpg", coins: 12500 },
    { _id: 2, name: "Michael Chen", photoURL: "https://randomuser.me/api/portraits/men/2.jpg", coins: 10800 },
    { _id: 3, name: "Emily Davis", photoURL: "https://randomuser.me/api/portraits/women/3.jpg", coins: 9500 },
    { _id: 4, name: "David Wilson", photoURL: "https://randomuser.me/api/portraits/men/4.jpg", coins: 8700 },
    { _id: 5, name: "Lisa Brown", photoURL: "https://randomuser.me/api/portraits/women/5.jpg", coins: 7600 },
    { _id: 6, name: "James Taylor", photoURL: "https://randomuser.me/api/portraits/men/6.jpg", coins: 6800 },
  ];

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

  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    src={worker.photoURL}
                    alt={worker.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-1 right-2 w-3.5 h-3.5 bg-success rounded-full ring-2 ring-base-200"></div>
              </div>

              {/* Name */}
              <h3 className="text-lg font-semibold text-base-content mt-4 mb-2">
                {worker.name}
              </h3>

              {/* Coins */}
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Coins size={16} className="text-primary" />
                <span className="text-primary font-bold">{worker.coins.toLocaleString()}</span>
                <span className="text-xs text-base-content/50">coins</span>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-4 mt-4 pt-3 border-t border-base-300">
                <div className="text-center">
                  <div className="text-xs text-base-content/50">Tasks Done</div>
                  <div className="text-sm font-semibold text-base-content">
                    {Math.floor(worker.coins / 15)}+
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-base-content/50">Earnings</div>
                  <div className="text-sm font-semibold text-success">
                    ${Math.floor(worker.coins / 20)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium">
            View All Workers <TrendingUp size={14} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default TopWorker;

