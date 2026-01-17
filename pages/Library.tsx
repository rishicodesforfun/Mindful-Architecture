import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';
import { getDayContent } from '../data/curriculum';
import {
  MeditationIllustration,
  SleepCategoryIcon,
  AnxietyCategoryIcon,
  FocusCategoryIcon,
  BeginnersCategoryIcon,
  SoundsCategoryIcon,
  KidsCategoryIcon,
  LogoWatermark
} from '../components/Illustrations';

const Library: React.FC = () => {
  const navigate = useNavigate();
  const { user, isFavorite, toggleFavorite } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isDark = user.nightMode;

  const categories = [
    { id: 'sleep', title: 'Sleep', subtitle: 'Stories & Sounds', Icon: SleepCategoryIcon },
    { id: 'anxiety', title: 'Anxiety', subtitle: 'SOS & Relief', Icon: AnxietyCategoryIcon },
    { id: 'focus', title: 'Focus', subtitle: 'Work & Study Flow', Icon: FocusCategoryIcon },
    { id: 'beginners', title: 'Beginners', subtitle: 'Start Here', Icon: BeginnersCategoryIcon },
    { id: 'sounds', title: 'Sounds', subtitle: 'Nature & White Noise', Icon: SoundsCategoryIcon },
    { id: 'kids', title: 'Kids', subtitle: 'Stories & Calm', Icon: KidsCategoryIcon },
  ];

  const sessions = [
    { id: '1', title: 'Morning Clarity', duration: 10, category: 'focus' },
    { id: '2', title: 'Sleep Stories', duration: 15, category: 'sleep' },
    { id: '3', title: 'Anxiety Relief', duration: 8, category: 'anxiety' },
    { id: '4', title: 'Deep Focus Flow', duration: 20, category: 'focus' },
    { id: '5', title: 'Bedtime Wind Down', duration: 12, category: 'sleep' },
    { id: '6', title: 'Ocean Sounds', duration: 30, category: 'sounds' },
  ];

  const filteredSessions = sessions.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get favorite days content
  const favoriteDays = user.favoriteDays
    .map(day => getDayContent(day))
    .filter(Boolean);

  return (
    <div className={`relative min-h-screen ${isDark ? 'bg-[#0B1121]' : 'bg-[#F5F7F4]'
      } font-['Epilogue'] pb-24 overflow-hidden transition-colors duration-300`}>

      {/* Logo Watermark */}
      <LogoWatermark className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Header */}
      <header className={`sticky top-0 z-30 px-5 pt-12 pb-4 ${isDark ? 'bg-[#0B1015]/80' : 'bg-[#fafafa]/80'
        } backdrop-blur-xl`}>
        <h1 className={`text-3xl font-bold tracking-tight mb-4 ${isDark ? 'text-white' : 'text-[#111817]'}`}>
          Library
        </h1>

        {/* Search Bar */}
        <div className="relative">
          <span className={`absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] ${isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>search</span>
          <input
            type="text"
            placeholder="Find clarity, sleep, focus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-2xl ${isDark
              ? 'bg-[#151E32] text-white placeholder:text-gray-500 border border-white/5'
              : 'bg-white text-[#111817] placeholder:text-gray-400 border border-gray-100'
              } focus:outline-none focus:ring-2 focus:ring-[#3D6B5B]/30`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] ${isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
            >close</button>
          )}
        </div>
      </header>

      <main className="relative z-10 px-5 pt-4 space-y-8">

        {/* Favorites Section */}
        {favoriteDays.length > 0 && (
          <section>
            <h2 className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
              <span className="material-symbols-outlined text-red-500 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              Your Favorites
            </h2>

            <div className="space-y-3">
              {favoriteDays.map((day) => day && (
                <div
                  key={day.day}
                  onClick={() => navigate(`/day/${day.day}`)}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] ${isDark ? 'bg-[#161B22]' : 'bg-white'
                    } shadow-sm ring-1 ${isDark ? 'ring-red-500/20' : 'ring-red-100'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-red-400 to-red-600`}>
                    <span className="material-symbols-outlined text-white">spa</span>
                  </div>

                  <div className="flex-1">
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                      Day {day.day}: {day.title}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {day.meditation.title} • {day.meditation.duration} min
                    </p>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(day.day); }}
                    className="p-2"
                  >
                    <span className="material-symbols-outlined text-red-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Section */}
        <section>
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>Featured Today</h2>

          <div
            onClick={() => navigate('/player')}
            className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${isDark ? 'bg-[#161B22]' : 'bg-white'
              } shadow-sm`}
          >
            <div className="flex items-center p-5 gap-4">
              <div className="flex-1">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isDark ? 'bg-[#5EEAD4]/10' : 'bg-[#4b9b87]/10'
                  } mb-2`}>
                  <span className={`material-symbols-outlined text-[12px] ${isDark ? 'text-[#5EEAD4]' : 'text-[#4b9b87]'
                    }`}>spark</span>
                  <span className={`text-[10px] font-bold ${isDark ? 'text-[#5EEAD4]' : 'text-[#4b9b87]'}`}>
                    New Series
                  </span>
                </div>
                <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                  Morning Clarity
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Start your day with intention and calm.
                </p>
              </div>

              <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                <MeditationIllustration className="w-full h-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Browse by Topic */}
        <section>
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>Browse by Topic</h2>

          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                  className={`flex flex-col items-center p-4 rounded-2xl transition-all ${isSelected
                    ? 'ring-2 ring-[#4b9b87] dark:ring-[#5EEAD4]'
                    : ''
                    } ${isDark ? 'bg-[#161B22]' : 'bg-white'} shadow-sm hover:shadow-md`}
                >
                  <div className="w-16 h-16 mb-2">
                    <cat.Icon className="w-full h-full" />
                  </div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                    {cat.title}
                  </h3>
                  <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {cat.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Sessions List (if category selected or search active) */}
        {(selectedCategory || searchQuery) && (
          <section>
            <h2 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
              {selectedCategory
                ? categories.find(c => c.id === selectedCategory)?.title
                : 'Search Results'}
            </h2>

            <div className="space-y-3">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => navigate('/player')}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] ${isDark ? 'bg-[#161B22]' : 'bg-white'
                    } shadow-sm`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#5EEAD4]/10' : 'bg-[#4b9b87]/10'
                    }`}>
                    <span className={`material-symbols-outlined ${isDark ? 'text-[#5EEAD4]' : 'text-[#4b9b87]'}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}>
                      spa
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                      {session.title}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {session.duration} min
                    </p>
                  </div>

                  <span className={`material-symbols-outlined ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                    chevron_right
                  </span>
                </div>
              ))}

              {filteredSessions.length === 0 && (
                <div className="text-center py-12">
                  <span className={`material-symbols-outlined text-4xl mb-2 ${isDark ? 'text-gray-600' : 'text-gray-300'
                    }`}>search_off</span>
                  <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>No sessions found</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Library;