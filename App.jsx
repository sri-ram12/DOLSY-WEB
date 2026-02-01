import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import LoginModal from "./LoginModal"; // ⬅ added import

const App = () => {
  const [sidebarClosed, setSidebarClosed] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [activePage, setActivePage] = useState("home");
  const [username, setUsername] = useState("User");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileImg, setProfileImg] = useState(null);

  // ⬅ new state for login popup
  const [loginOpen, setLoginOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [pageToken, setPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const hiddenPlayerRef = useRef(null);

  // player UI state
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // single source of truth for the song shown in the bottom player
  const [currentSong, setCurrentSong] = useState(null);

  // recently played songs (max 30)
  const [recentSongs, setRecentSongs] = useState([]);

  // categories data (extended)
  const musicCategories = {
    Heartbreak: {
      icon: "💔",
      songs: [
        { title: "Someone Like You", artist: "Adele" },
        { title: "Back to December", artist: "Taylor Swift" },
      ],
    },
    Love: {
      icon: "❤",
      songs: [
        { title: "Perfect", artist: "Ed Sheeran" },
        { title: "All of Me", artist: "John Legend" },
      ],
    },
    Melody: {
      icon: "♫",
      songs: [
        { title: "Stay With Me", artist: "Sam Smith" },
        { title: "Let Her Go", artist: "Passenger" },
      ],
    },
    Party: {
      icon: "★",
      songs: [
        { title: "Uptown Funk", artist: "Bruno Mars" },
        { title: "Shape of You", artist: "Ed Sheeran" },
      ],
    },
    Rock: {
      icon: "♬",
      songs: [
        { title: "Bohemian Rhapsody", artist: "Queen" },
        { title: "Smells Like Teen Spirit", artist: "Nirvana" },
      ],
    },
    "Hip Hop": {
      icon: "♪",
      songs: [
        { title: "Lose Yourself", artist: "Eminem" },
        { title: "God's Plan", artist: "Drake" },
      ],
    },
    Classical: {
      icon: "🎼",
      songs: [
        { title: "Fur Elise", artist: "Beethoven" },
        { title: "The Four Seasons", artist: "Vivaldi" },
      ],
    },
    Chill: {
      icon: "☾",
      songs: [
        { title: "Sunflower", artist: "Post Malone" },
        { title: "Lovely", artist: "Billie Eilish" },
      ],
    },
    Workout: {
      icon: "⚡",
      songs: [
        { title: "Stronger", artist: "Kanye West" },
        { title: "Till I Collapse", artist: "Eminem" },
      ],
    },
    Travel: {
      icon: "✈",
      songs: [
        { title: "On the Road Again", artist: "Willie Nelson" },
        { title: "Life is a Highway", artist: "Rascal Flatts" },
      ],
    },
    Happy: {
      icon: "☺",
      songs: [
        { title: "Happy", artist: "Pharrell Williams" },
        { title: "Best Day of My Life", artist: "American Authors" },
      ],
    },
    Sad: {
      icon: "☹",
      songs: [
        { title: "Fix You", artist: "Coldplay" },
        { title: "Let It Go", artist: "James Bay" },
      ],
    },
    Romantic: {
      icon: "❥",
      songs: [
        { title: "Thinking Out Loud", artist: "Ed Sheeran" },
        { title: "Can't Help Falling in Love", artist: "Elvis Presley" },
      ],
    },
    Motivation: {
      icon: "✊",
      songs: [
        { title: "Eye of the Tiger", artist: "Survivor" },
        { title: "Hall of Fame", artist: "The Script" },
      ],
    },
    Oldies: {
      icon: "☼",
      songs: [
        { title: "Yesterday", artist: "The Beatles" },
        { title: "Hotel California", artist: "Eagles" },
      ],
    },
    Dance: {
      icon: "❂",
      songs: [
        { title: "Levitating", artist: "Dua Lipa" },
        { title: "Wake Me Up", artist: "Avicii" },
      ],
    },
    Devotional: {
      icon: "☸",
      songs: [
        { title: "Om Jai Jagdish", artist: "Traditional" },
        { title: "Hanuman Chalisa", artist: "Traditional" },
      ],
    },
    Jazz: {
      icon: "♩",
      songs: [
        { title: "Take Five", artist: "Dave Brubeck" },
        { title: "So What", artist: "Miles Davis" },
      ],
    },
    Lofi: {
      icon: "🌙",
      songs: [
        { title: "Study Vibes", artist: "Lofi Girl" },
        { title: "Night Walk", artist: "Chillhop" },
      ],
    },
    EDM: {
      icon: "🔊",
      songs: [
        { title: "Animals", artist: "Martin Garrix" },
        { title: "Don't You Worry Child", artist: "Swedish House Mafia" },
      ],
    },
    Bollywood: {
      icon: "🎬",
      songs: [
        { title: "Tum Hi Ho", artist: "Arijit Singh" },
        { title: "Kala Chashma", artist: "Amar Arshi" },
      ],
    },
    Telugu: {
      icon: "🥁",
      songs: [
        { title: "Butta Bomma", artist: "Armaan Malik" },
        { title: "Srivalli", artist: "Sid Sriram" },
      ],
    },
    Tamil: {
      icon: "🎻",
      songs: [
        { title: "Why This Kolaveri Di", artist: "Dhanush" },
        { title: "Munbe Vaa", artist: "Shreya Ghoshal" },
      ],
    },
    Instrumental: {
      icon: "🎹",
      songs: [
        { title: "River Flows in You", artist: "Yiruma" },
        { title: "Comptine d’un autre été", artist: "Yann Tiersen" },
      ],
    },
    Retro: {
      icon: "📻",
      songs: [
        { title: "Billie Jean", artist: "Michael Jackson" },
        { title: "Stayin' Alive", artist: "Bee Gees" },
      ],
    },
  };

  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);

    const storedRecent = localStorage.getItem("dolsy_recent_songs");
    if (storedRecent) {
      try {
        setRecentSongs(JSON.parse(storedRecent));
      } catch {
        setRecentSongs([]);
      }
    }
  }, []);

  // apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      document.body.style.background =
        "linear-gradient(135deg,#111 0%,#222 100%)";
      document.body.style.color = "#fff";
      root.style.setProperty("--sidebar-bg", "#fff");
      root.style.setProperty("--option-color", "#000");
      root.style.setProperty("--button-bg", "#fff");
      root.style.setProperty("--button-color", "#000");
      root.style.setProperty("--text-color", "#fff");
      root.style.setProperty("--header-bg", "rgba(0,0,0,0.85)");
      root.style.setProperty("--album-text-color", "#ffffff");
      root.style.setProperty("--album-bg", "#000000");
      root.style.setProperty("--note-color", "#ffffff");
      root.style.setProperty("--card-bg", "#111111");
      root.style.setProperty("--card-border", "#ffffff");
      root.style.setProperty("--card-inner-bg", "#222222");
    } else {
      document.body.style.background =
        "linear-gradient(135deg,#f5f5f5 0%,#e0e0e0 100%)";
      document.body.style.color = "#111";
      root.style.setProperty("--sidebar-bg", "#000");
      root.style.setProperty("--option-color", "#fff");
      root.style.setProperty("--button-bg", "#000");
      root.style.setProperty("--button-color", "#fff");
      root.style.setProperty("--text-color", "#111");
      root.style.setProperty("--header-bg", "rgba(255,255,255,0.95)");
      root.style.setProperty("--album-text-color", "#000000");
      root.style.setProperty("--album-bg", "#ffffff");
      root.style.setProperty("--note-color", "#000000");
      root.style.setProperty("--card-bg", "#ffffff");
      root.style.setProperty("--card-border", "#000000");
      root.style.setProperty("--card-inner-bg", "#f1f1f1");
    }
  }, [theme]);

  const toggleSidebar = () => setSidebarClosed((p) => !p);

  // UPDATED: open login modal instead of redirect
  const goLogin = () => setLoginOpen(true);
  const goSignup = () => (window.location.href = "signup.html");

  const buildPlayerUrl = (id) => {
    if (!id) return "";
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1`;
  };

  // add song to recent list (keep latest 30)
  const addToRecent = (song) => {
    if (!song) return;
    setRecentSongs((prev) => {
      const filtered = prev.filter((s) => s.id !== song.id);
      const updated = [song, ...filtered].slice(0, 30);
      localStorage.setItem("dolsy_recent_songs", JSON.stringify(updated));
      return updated;
    });
  };

  // unified play function that can handle any song object with an id
  const playSongObject = (song, indexInSongs = null) => {
    if (!song || !song.id || !hiddenPlayerRef.current) return;
    hiddenPlayerRef.current.src = buildPlayerUrl(song.id);

    // maintain index for future next/prev if it belongs to songs[]
    if (indexInSongs !== null && indexInSongs !== undefined) {
      setCurrentIndex(indexInSongs);
    } else {
      setCurrentIndex(null);
    }

    // update the true currentSong used by bottom player
    setCurrentSong(song);
    addToRecent(song);
    setIsPlaying(true);
  };

  // click album -> play + update recent
  const playSong = (id) => {
    if (!id) return;
    const idx = songs.findIndex((s) => s.id === id);
    if (idx !== -1) {
      playSongObject(songs[idx], idx);
    } else {
      // if not in songs (edge case), try to find in recentSongs
      const rIdx = recentSongs.findIndex((s) => s.id === id);
      if (rIdx !== -1) {
        playSongObject(recentSongs[rIdx], null);
      }
    }
  };

  // Search songs - FIRST PAGE
  const searchSongs = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSongs([]);
    setPageToken(null);
    setHasMore(false);
    setCurrentIndex(null);
    // you may want to clear currentSong on new search, optional:
    // setCurrentSong(null);

    try {
      const res = await fetch(
        `http://127.0.0.1:5000/search?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Backend error " + res.status);
      const data = await res.json();

      if (data.songs && Array.isArray(data.songs)) {
        setSongs(data.songs);
        setPageToken(data.nextPageToken || null);
        setHasMore(!!data.nextPageToken);
      } else if (Array.isArray(data)) {
        setSongs(data);
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to fetch songs");
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  // Load more songs - NEXT PAGE
  const loadMoreSongs = async () => {
    if (!pageToken || loading) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/search?q=${encodeURIComponent(
          query
        )}&pageToken=${pageToken}`
      );
      if (!res.ok) throw new Error("Backend error " + res.status);
      const data = await res.json();

      if (data.songs && Array.isArray(data.songs)) {
        setSongs((prev) => [...prev, ...data.songs]);
        setPageToken(data.nextPageToken || null);
        setHasMore(!!data.nextPageToken);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to load more songs");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfileImg(url);
  };

  const renderHome = () => (
    <>
      <div className="header-box sticky-header">
        <h1>
          DOLSY MUSIC <span className="music-icon">🎧</span>
        </h1>

        <div className="search-container">
          <input
            id="searchBar"
            type="text"
            placeholder="Search for Music"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchSongs()}
          />
          <span
            className="search-icon"
            onClick={!loading ? searchSongs : undefined}
          >
            🔍
          </span>
        </div>
      </div>

      <div className="album-slider">
        <div className="album-track">
          {songs.length === 0 && query.trim() && !loading && (
            <p className="no-songs">No songs found</p>
          )}

          {songs.map((s, i) => (
            <div
              className="album"
              key={s.id || i}
              onClick={() => playSong(s.id)}
            >
              <div className="album-img-wrapper">
                <img
                  src={
                    s.thumbnail || `https://picsum.photos/260?random=${i + 1}`
                  }
                  alt="Album art"
                />
              </div>
              <div className="album-text-box">
                <p className="album-title">{s.title || "Unknown Title"}</p>
                <p className="album-artist">
                  {s.artist || "Unknown Artist"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {hasMore && songs.length > 0 && (
        <button
          className="load-more-btn"
          onClick={loadMoreSongs}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More Songs"}
        </button>
      )}

      {songs.length > 0 && !hasMore && (
        <p className="no-more">No more songs</p>
      )}
    </>
  );

  const renderMyPlaylist = () => (
    <>
      <h2>My Playlist</h2>
      <div style={{ textAlign: "center" }}>
        <input
          type="file"
          id="localMusic"
          accept="audio/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const url = URL.createObjectURL(file);
              sessionStorage.setItem("musicUrl", url);
              sessionStorage.setItem("musicName", file.name);
              window.location.href = "musicplayer.html";
            }
          }}
        />
        <button
          className="option-btn"
          onClick={() => document.getElementById("localMusic").click()}
        >
          Device Music
        </button>
        <button
          className="option-btn"
          onClick={() => alert("YouTube Music Clicked")}
        >
          YouTube Music
        </button>
      </div>
    </>
  );

  // Recent as list view (from recentSongs, max 30)
  const renderRecent = () => (
    <>
      <h2>Recent</h2>
      {recentSongs.length === 0 ? (
        <p className="no-songs">No recent songs yet.</p>
      ) : (
        <ul className="recent-list">
          {recentSongs.map((s, i) => (
            <li
              key={s.id || `recent-${i}`}
              className="recent-item"
              onClick={() =>
                playSongObject(s, songs.findIndex((x) => x.id === s.id))
              }
            >
              <img
                className="recent-thumb"
                src={
                  s.thumbnail ||
                  `https://picsum.photos/80?random=recent-${i + 1}`
                }
                alt="Cover"
              />
              <div className="recent-info">
                <div className="recent-title">
                  {s.title || "Unknown Title"}
                </div>
                <div className="recent-artist">
                  {s.artist || "Unknown Artist"}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  const renderedCategorySongs = () => {
    if (!selectedCategory) return null;
    const cat = musicCategories[selectedCategory];
    if (!cat) return null;
    return (
      <div className="category-songs">
        <div className="category-songs-header">
          <h3>
            {cat.icon} {selectedCategory} Songs
          </h3>
          <button
            className="back-btn"
            onClick={() => setSelectedCategory(null)}
          >
            Back to Categories
          </button>
        </div>
        {cat.songs.map((song, idx) => (
          <div key={idx} className="category-song-row">
            <span>{song.title}</span>
            <span>{song.artist}</span>
            <button
              className="category-play-btn"
              onClick={() =>
                alert(
                  `Hook this to play "${song.title}" by ${song.artist} from category`
                )
              }
            >
              Play
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderAlbums = () => (
    <>
      <div className="category-section">
        <h2 className="category-title">Albums & Moods</h2>
        {!selectedCategory && (
          <div className="category-grid">
            {Object.entries(musicCategories).map(([name, cfg]) => (
              <div
                key={name}
                className="category-card"
                onClick={() => setSelectedCategory(name)}
              >
                <div className="category-icon">{cfg.icon}</div>
                <div className="category-name">{name}</div>
              </div>
            ))}
          </div>
        )}
        {renderedCategorySongs()}
      </div>
    </>
  );

  return (
    <div className="app-root">
      <aside className={`sidebar ${sidebarClosed ? "closed" : ""}`}>
        <div className="profile">
          <img
            alt="Profile"
            src={
              profileImg ||
              "data:image/svg+xml;utf8,<svg width='120' height='120' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><circle cx='100' cy='70' r='50' fill='black'/><rect x='35' y='120' width='130' height='60' rx='60' fill='black'/></svg>"
            }
            onClick={() => setProfileModalOpen(true)}
          />
          <p>Welcome, {username}</p>
        </div>
        <div className="menu">
          <button
            className={`menu-item ${activePage === "home" ? "active" : ""}`}
            onClick={() => setActivePage("home")}
          >
            🏠 Home
          </button>
          <button
            className={`menu-item ${
              activePage === "recent" ? "active" : ""
            }`}
            onClick={() => setActivePage("recent")}
          >
            🕘 Recent
          </button>
          <button
            className={`menu-item ${
              activePage === "albums" ? "active" : ""
            }`}
            onClick={() => {
              setActivePage("albums");
              setSelectedCategory(null);
            }}
          >
            🎵 Albums
          </button>
          <button
            className={`menu-item ${
              activePage === "myPlaylist" ? "active" : ""
            }`}
            onClick={() => setActivePage("myPlaylist")}
          >
            📂 My Playlist
          </button>
          <button className="menu-item" onClick={() => setTheme("dark")}>
            🌑 Dark
          </button>
          <button className="menu-item" onClick={() => setTheme("light")}>
            🌞 Light
          </button>
          <button
            className="menu-item"
            onClick={() => {
              const ok = window.confirm("Do you want to logout?");
              if (ok) window.location.href = "loginpage.html";
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <div className={`content ${sidebarClosed ? "full" : ""}`}>
        <button className="toggle-btn" onClick={toggleSidebar}>
          ☰
        </button>

        <div className="top-auth">
          <button onClick={goLogin}>Login</button>
          <button onClick={goSignup}>Sign Up</button>
        </div>

        <div className="page-container">
          {activePage === "home" && renderHome()}
          {activePage === "myPlaylist" && renderMyPlaylist()}
          {activePage === "recent" && renderRecent()}
          {activePage === "albums" && renderAlbums()}
        </div>

        <div className="floating-notes">
          <span>♪</span>
          <span>♫</span>
          <span>♬</span>
          <span>♩</span>
          <span>♪</span>
          <span>𝄞</span>
          <span>♬</span>
          <span>♪</span>
          <span>♬</span>
          <span>𝄞</span>
        </div>

        <footer>© 2025 Dolsy Music</footer>
      </div>

      {profileModalOpen && (
        <div
          className="profile-modal-overlay"
          onClick={(e) =>
            e.target.classList.contains("profile-modal-overlay") &&
            setProfileModalOpen(false)
          }
        >
          <div className="profile-modal">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="profile-form"
            >
              <div style={{ textAlign: "center" }}>
                <label htmlFor="profileUpload" style={{ cursor: "pointer" }}>
                  <img
                    alt="Profile"
                    className="profile-modal-img"
                    src={
                      profileImg ||
                      "data:image/svg+xml;utf8,<svg width='140' height='140' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><circle cx='100' cy='70' r='50' fill='black'/><rect x='35' y='120' width='130' height='60' rx='60' fill='black'/></svg>"
                    }
                  />
                  <input
                    id="profileUpload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleProfileImgChange}
                  />
                </label>
              </div>
              <h2>Profile Settings</h2>
              <label>
                <b>Name</b>
                <input type="text" placeholder="Enter your name" />
              </label>
              <label>
                <b>Email</b>
                <input type="email" placeholder="Enter your email" />
              </label>
              <label>
                <b>Date of Birth</b>
                <input type="date" />
              </label>
              <label>
                <b>Place</b>
                <input type="text" placeholder="Enter your place" />
              </label>
              <label>
                <b>Region</b>
                <input type="text" placeholder="Enter your region" />
              </label>
              <div className="profile-buttons">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                >
                  Back
                </button>
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* bottom player bar */}
      {currentSong && (
        <div
          className={`bottom-player ${
            sidebarClosed ? "sidebar-closed" : "sidebar-open"
          } ${sidebarClosed ? "bp-vertical" : ""}`}
        >
          <div className="bp-left">
            <div
              className={`bp-poster ${
                sidebarClosed ? "bp-poster-tall" : ""
              }`}
            >
              <img
                src={
                  currentSong.thumbnail ||
                  "https://via.placeholder.com/120x120?text=Dolsy"
                }
                alt="Current"
              />
            </div>
            <div className="bp-info">
              <div className="bp-title">
                {currentSong.title || "Unknown Title"}
              </div>
              <div className="bp-artist">
                {currentSong.artist || "Unknown Artist"}
              </div>
            </div>
          </div>

          <div className="bp-center">
            <div className="bp-controls-row">
              <div className="bp-main-controls">
                <button className="bp-flat-btn" title="Previous">
                  ⏮
                </button>
                <button
                  className="bp-flat-btn"
                  title={isPlaying ? "Pause" : "Play"}
                  onClick={() => setIsPlaying((p) => !p)}
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>
                <button className="bp-flat-btn" title="Next">
                  ⏭
                </button>
              </div>

              <button className="bp-icon-btn" title="Like">
                ♥
              </button>
            </div>
          </div>

          <div className="bp-right">
            <span className="bp-vol-label">VOL</span>
            <div className="bp-vol-bars">
              <span className="bp-vol-bar active" />
              <span className="bp-vol-bar active" />
              <span className="bp-vol-bar active" />
              <span className="bp-vol-bar" />
            </div>
          </div>
        </div>
      )}

      <iframe
        ref={hiddenPlayerRef}
        title="Dolsy audio player"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        className="hidden-player"
      />

      {/* Login popup component */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={(user) => {
          if (user?.name) setUsername(user.name);
        }}
      />
    </div>
  );
};

export default App;
