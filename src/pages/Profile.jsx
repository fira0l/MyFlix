import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Camera, Save, CheckCircle, AlertCircle, Loader2, Heart, Eye, Bookmark, PlayCircle, Clock, Film, LogOut } from 'lucide-react';
import { userAPI, movieAPI } from '../services/api';

const defaultAvatars = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
  'https://i.pravatar.cc/150?img=5',
  'https://i.pravatar.cc/150?img=6',
  'https://i.pravatar.cc/150?img=7',
  'https://i.pravatar.cc/150?img=8',
];

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [stats, setStats] = useState({ liked: 0, watched: 0, watchlist: 0, continueWatching: 0, recentlyWatched: 0, added: 0 });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setEmail(user.email || '');
      setName(user.name || '');
      setAvatar(user.avatar || defaultAvatars[0]);
    }

    // Load stats
    Promise.all([
      userAPI.getLikedMovies(),
      userAPI.getWatchedMovies(),
      userAPI.getWatchlist(),
      userAPI.getContinueWatching(),
      userAPI.getRecentlyWatched(),
      movieAPI.getAll(),
    ]).then(([liked, watched, watchlist, continueW, recent, added]) => {
      setStats({
        liked: liked.length,
        watched: watched.length,
        watchlist: watchlist.length,
        continueWatching: continueW.length,
        recentlyWatched: recent.length,
        added: added.length,
      });
    }).catch(() => {});
  }, []);

  const handleSave = () => {
    setErrors({});
    if (!name.trim()) { setErrors({ name: 'Name is required' }); return; }
    if (name.length > 50) { setErrors({ name: 'Name must be 50 characters or less' }); return; }
    setIsLoading(true);
    setTimeout(() => {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      localStorage.setItem('user', JSON.stringify({ ...user, name, avatar }));
      window.dispatchEvent(new Event('userChanged'));
      setSaved(true);
      setIsLoading(false);
      setTimeout(() => setSaved(false), 2500);
    }, 1000);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setErrors({ avatar: 'Please upload a valid image file' }); return; }
    if (file.size > 2 * 1024 * 1024) { setErrors({ avatar: 'Image size must be less than 2MB' }); return; }
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userChanged'));
    navigate('/');
  };

  const statItems = [
    { icon: Heart, label: 'Liked', value: stats.liked, color: '#e50914' },
    { icon: Eye, label: 'Watched', value: stats.watched, color: '#22c55e' },
    { icon: Bookmark, label: 'Watchlist', value: stats.watchlist, color: '#3b82f6' },
    { icon: PlayCircle, label: 'In Progress', value: stats.continueWatching, color: '#f59e0b' },
    { icon: Clock, label: 'History', value: stats.recentlyWatched, color: '#8b5cf6' },
    { icon: Film, label: 'Added', value: stats.added, color: '#ec4899' },
  ];

  const tabs = [
    { id: 'profile', label: 'Profile Info' },
    { id: 'avatar', label: 'Avatar' },
    { id: 'stats', label: 'My Stats' },
  ];

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: 'linear-gradient(135deg, #080810 0%, #0a0a14 100%)' }}>
      <div className="container mx-auto max-w-3xl">

        {/* Profile Hero */}
        <div className="skeu-card p-8 mb-6 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #e50914, transparent)', filter: 'blur(40px)' }} />

          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden"
                style={{ boxShadow: '0 0 0 3px rgba(229,9,20,0.4), 0 8px 24px rgba(0,0,0,0.5)' }}>
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(145deg, #e50914, #b8070f)' }}>
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(145deg, #e50914, #b8070f)', boxShadow: '0 2px 8px rgba(229,9,20,0.5)' }}>
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-black text-white mb-1">
                {name || email.split('@')[0]}
              </h1>
              <p className="text-gray-400 text-sm mb-3">{email}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(229,9,20,0.15)', color: '#ff6b6b', border: '1px solid rgba(229,9,20,0.25)' }}>
                  MyFlix Member
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                  ● Active
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all self-start"
              style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)', color: '#ff6b6b' }}
              onClick={handleLogout}
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="skeu-card p-6">
          {/* Tab Headers */}
          <div className="flex gap-2 p-1 rounded-xl mb-6" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {tabs.map(tab => (
              <button key={tab.id}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
                style={{
                  background: activeTab === tab.id ? 'linear-gradient(145deg, #e50914, #b8070f)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#6b7280',
                  boxShadow: activeTab === tab.id ? '0 4px 12px rgba(229,9,20,0.3), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none'
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Info Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              {saved && (
                <div className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <p className="text-green-400 text-sm font-medium">Profile updated successfully!</p>
                </div>
              )}

              {errors.general && (
                <div className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
              )}

              {/* Display Name */}
              <div>
                <label className="text-gray-300 text-sm font-semibold mb-2 block">Display Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  <input
                    className="skeu-input w-full pl-11 pr-4 py-3.5 text-sm"
                    placeholder="Enter your display name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ borderColor: errors.name ? 'rgba(229,9,20,0.5)' : undefined }}
                  />
                </div>
                {errors.name && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    <p className="text-red-400 text-xs">{errors.name}</p>
                  </div>
                )}
              </div>

              {/* Email (disabled) */}
              <div>
                <label className="text-gray-300 text-sm font-semibold mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                  <input
                    className="skeu-input w-full pl-11 pr-4 py-3.5 text-sm opacity-50 cursor-not-allowed"
                    value={email}
                    disabled
                  />
                </div>
                <p className="text-gray-600 text-xs mt-1.5">Email address cannot be changed</p>
              </div>

              <button
                className="skeu-btn w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : saved ? (
                  <><CheckCircle className="w-4 h-4" /> Saved!</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Changes</>
                )}
              </button>
            </div>
          )}

          {/* Avatar Tab */}
          {activeTab === 'avatar' && (
            <div className="space-y-6">
              {/* Current Avatar Preview */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28 rounded-full overflow-hidden"
                  style={{ boxShadow: '0 0 0 4px rgba(229,9,20,0.3), 0 12px 30px rgba(0,0,0,0.6)' }}>
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(145deg, #e50914, #b8070f)' }}>
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-gray-400 text-sm">Current avatar</p>
              </div>

              {errors.avatar && (
                <div className="flex items-center gap-2 p-3 rounded-xl"
                  style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-red-400 text-xs">{errors.avatar}</p>
                </div>
              )}

              {/* Upload Custom */}
              <div>
                <label className="text-gray-300 text-sm font-semibold mb-3 block">Upload Custom Avatar</label>
                <label className="cursor-pointer block">
                  <div className="flat-card p-6 text-center hover:border-red-500/30 transition-all"
                    style={{ border: '2px dashed rgba(255,255,255,0.1)' }}>
                    <Camera className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm font-medium">Click to upload image</p>
                    <p className="text-gray-600 text-xs mt-1">JPG, PNG, GIF · Max 2MB</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>

              {/* Default Avatars */}
              <div>
                <label className="text-gray-300 text-sm font-semibold mb-3 block">Choose Default Avatar</label>
                <div className="grid grid-cols-4 gap-3">
                  {defaultAvatars.map((src, i) => (
                    <div key={i}
                      className="relative cursor-pointer rounded-full overflow-hidden transition-all"
                      style={{
                        width: '64px', height: '64px',
                        boxShadow: avatar === src ? '0 0 0 3px #e50914, 0 4px 12px rgba(229,9,20,0.4)' : '0 2px 8px rgba(0,0,0,0.4)',
                        transform: avatar === src ? 'scale(1.1)' : 'scale(1)',
                      }}
                      onClick={() => setAvatar(src)}
                    >
                      <img src={src} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                      {avatar === src && (
                        <div className="absolute inset-0 flex items-center justify-center"
                          style={{ background: 'rgba(229,9,20,0.3)' }}>
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button className="skeu-btn w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2"
                onClick={handleSave} disabled={isLoading}>
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Avatar</>}
              </button>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {statItems.map(({ icon: Icon, label, value, color }, i) => (
                  <div key={i} className="flat-card p-5 text-center hover:border-white/15 transition-all">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <div className="text-3xl font-black text-white mb-1">{value}</div>
                    <div className="text-gray-500 text-xs">{label}</div>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="space-y-2">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Quick Navigation</p>
                {[
                  { label: 'View Watchlist & Added', to: '/watchlist' },
                  { label: 'Continue Watching', to: '/continue-watching' },
                  { label: 'Recently Watched', to: '/recently-watched' },
                  { label: 'My Dashboard', to: '/dashboard' },
                ].map((link, i) => (
                  <button key={i}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    onClick={() => navigate(link.to)}
                  >
                    {link.label}
                    <span className="text-gray-600">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
