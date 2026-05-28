import { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [movies, setMovies]             = useState([]);
  const [search, setSearch]             = useState("");
  const [selected, setSelected]         = useState("");
  const [recommended, setRecommended]   = useState([]);
  const [loading, setLoading]           = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingDots, setLoadingDots]   = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    axios.get("https://movie-recommender-backend-q93b.onrender.com/movies")
      .then(res => setMovies(res.data.movies))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingDots(d => d.length >= 3 ? "" : d + ".");
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

  const filteredMovies = movies.filter(m =>
    m.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (movie) => {
    setSelected(movie);
    setSearch(movie);
    setShowDropdown(false);
  };

  const recommend = () => {
    if (!selected) return;
    setLoading(true);
    setRecommended([]);
    axios.get(`https://movie-recommender-backend-q93b.onrender.com/recommend?movie=${selected}`)
      .then(res => { setRecommended(res.data.movies); setLoading(false); })
      .catch(err => { console.log(err); setLoading(false); });
  };

  return (
    <div style={s.page}>

      {/* Noise overlay */}
      <div style={s.noise} />

      {/* Top red glow */}
      <div style={s.glowTop} />

      {/* NAVBAR */}
      <nav style={s.nav}>
        <span style={s.navLogo}>🎬 CINAI</span>
        <span style={s.navTagline}>AI-Powered Recommendations</span>
      </nav>

      {/* HERO SECTION */}
      <div style={s.hero}>
        <div style={s.heroBadge}>✦ Powered by Machine Learning</div>
        <h1 style={s.heroTitle}>
          Find Your Next<br />
          <span style={s.heroAccent}>Favourite Film</span>
        </h1>
        <p style={s.heroSub}>
          Tell us one movie you love. We'll find five you'll obsess over.
        </p>

        {/* SEARCH BOX */}
        <div style={s.searchSection} ref={wrapperRef}>
          <div style={s.searchBox}>
            <span style={s.searchIcon}>🔍</span>
            <input
              style={s.input}
              type="text"
              placeholder="Search a movie title..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setSelected("");
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
            {search && (
              <span style={s.clearBtn} onClick={() => { setSearch(""); setSelected(""); setRecommended([]); }}>✕</span>
            )}
          </div>

          <button
            style={{ ...s.btn, ...((!selected || loading) ? s.btnDisabled : {}) }}
            onClick={recommend}
            disabled={!selected || loading}
          >
            {loading ? `Searching${loadingDots}` : "Get Recommendations →"}
          </button>

          {/* DROPDOWN */}
          {showDropdown && search.length > 0 && filteredMovies.length > 0 && (
            <div style={s.dropdown}>
              {filteredMovies.slice(0, 7).map((movie, idx) => (
                <div
                  key={idx}
                  style={s.dropItem}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(229,9,20,0.1)";
                    e.currentTarget.style.paddingLeft = "22px";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.paddingLeft = "16px";
                  }}
                  onClick={() => handleSelect(movie)}
                >
                  <span style={s.dropIcon}>▶</span> {movie}
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && !showDropdown && (
          <p style={s.selectedTag}>
            Now showing results for: <strong style={{ color: "#e50914" }}>{selected}</strong>
          </p>
        )}
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div style={s.loadingSection}>
          <div style={s.spinner} />
          <p style={s.loadingText}>Analysing {selected}{loadingDots}</p>
        </div>
      )}

      {/* RESULTS */}
      {recommended.length > 0 && !loading && (
        <div style={s.results}>
          <div style={s.resultsHeader}>
            <div style={s.redLine} />
            <h2 style={s.resultsTitle}>Because you liked <span style={{ color: "#e50914" }}>{selected}</span></h2>
            <div style={s.redLine} />
          </div>

          <div style={s.grid}>
            {recommended.map((movie, idx) => (
              <div
                key={idx}
                style={s.card}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-12px) scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 24px 60px rgba(229,9,20,0.35)";
                  e.currentTarget.style.borderColor = "#e50914";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.5)";
                  e.currentTarget.style.borderColor = "#222";
                }}
              >
                {/* Rank ribbon */}
                <div style={s.ribbon}>{idx + 1}</div>

                {/* Poster placeholder */}
                <div style={s.posterBox}>
                  <span style={s.posterEmoji}>🎬</span>
                  <div style={s.posterGlow} />
                </div>

                <div style={s.cardBody}>
                  <p style={s.cardTitle}>{movie}</p>

                  {/* Match bar */}
                  <div style={s.matchLabel}>
                    <span>Match</span>
                    <span style={{ color: "#e50914", fontWeight: 700 }}>{95 - idx * 7}%</span>
                  </div>
                  <div style={s.barBg}>
                    <div style={{ ...s.barFill, width: `${95 - idx * 7}%` }} />
                  </div>

                  {/* <div style={s.watchBtn}>▶ Watch Now</div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={s.footerDivider} />
        <div style={s.footerContent}>
          <span style={s.footerLogo}>🎬 CINAI</span>
          <span style={s.footerText}>Built with Python · FastAPI · React · TMDB Dataset</span>
          <span style={s.footerCredit}>Created by <strong style={{ color: "#e50914" }}>YUVRAJ</strong></span>
        </div>
      </footer>

    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#080808",
    color: "#fff",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  noise: {
    position: "fixed",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
    pointerEvents: "none",
    zIndex: 0,
  },
  glowTop: {
    position: "fixed",
    top: "-200px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "800px",
    height: "400px",
    background: "radial-gradient(ellipse, rgba(229,9,20,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 48px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    position: "relative",
    zIndex: 10,
    backdropFilter: "blur(10px)",
  },
  navLogo: {
    fontSize: "22px",
    fontWeight: "900",
    letterSpacing: "3px",
    color: "#e50914",
    textTransform: "uppercase",
  },
  navTagline: {
    fontSize: "12px",
    color: "#555",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  hero: {
    textAlign: "center",
    padding: "80px 20px 60px",
    position: "relative",
    zIndex: 1,
  },
  heroBadge: {
    display: "inline-block",
    background: "rgba(229,9,20,0.12)",
    border: "1px solid rgba(229,9,20,0.3)",
    color: "#e50914",
    padding: "6px 18px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "1.5px",
    marginBottom: "28px",
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: "clamp(3rem, 7vw, 5.5rem)",
    fontWeight: "900",
    lineHeight: 1.1,
    margin: "0 0 20px",
    color: "#fff",
    letterSpacing: "-1px",
  },
  heroAccent: {
    background: "linear-gradient(135deg, #e50914 0%, #ff6b6b 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: {
    color: "#666",
    fontSize: "1.1rem",
    maxWidth: "460px",
    margin: "0 auto 48px",
    lineHeight: 1.7,
  },
  searchSection: {
    position: "relative",
    maxWidth: "620px",
    margin: "0 auto",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  searchBox: {
    flex: 1,
    minWidth: "260px",
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    padding: "0 16px",
    backdropFilter: "blur(10px)",
    transition: "border 0.2s",
  },
  searchIcon: {
    fontSize: "16px",
    marginRight: "10px",
    opacity: 0.5,
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: "15px",
    padding: "16px 0",
    fontFamily: "inherit",
  },
  clearBtn: {
    color: "#555",
    cursor: "pointer",
    fontSize: "14px",
    padding: "4px",
    transition: "color 0.2s",
  },
  btn: {
    padding: "16px 28px",
    fontSize: "14px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #e50914, #c20812)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
    boxShadow: "0 4px 20px rgba(229,9,20,0.4)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    right: "140px",
    background: "#111",
    border: "1px solid #222",
    borderRadius: "14px",
    zIndex: 999,
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
  },
  dropItem: {
    padding: "13px 16px",
    fontSize: "14px",
    color: "#ccc",
    cursor: "pointer",
    borderBottom: "1px solid #1a1a1a",
    textAlign: "left",
    transition: "background 0.15s, padding-left 0.15s",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  dropIcon: {
    color: "#e50914",
    fontSize: "10px",
  },
  selectedTag: {
    marginTop: "20px",
    fontSize: "13px",
    color: "#555",
    letterSpacing: "0.5px",
  },
  loadingSection: {
    textAlign: "center",
    padding: "60px 20px",
    position: "relative",
    zIndex: 1,
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "3px solid #222",
    borderTop: "3px solid #e50914",
    borderRadius: "50%",
    margin: "0 auto 20px",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    color: "#555",
    fontSize: "14px",
    letterSpacing: "1px",
  },
  results: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 20px 80px",
    position: "relative",
    zIndex: 1,
  },
  resultsHeader: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "40px",
  },
  redLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, transparent, #e50914, transparent)",
  },
  resultsTitle: {
    fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
    fontWeight: "600",
    color: "#aaa",
    whiteSpace: "nowrap",
    margin: 0,
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "24px",
  },
  card: {
    background: "linear-gradient(145deg, #111, #0d0d0d)",
    border: "1px solid #222",
    borderRadius: "20px",
    width: "190px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    position: "relative",
  },
  ribbon: {
    position: "absolute",
    top: "12px",
    left: "12px",
    background: "#e50914",
    color: "#fff",
    fontSize: "11px",
    fontWeight: "900",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    boxShadow: "0 2px 8px rgba(229,9,20,0.5)",
  },
  posterBox: {
    background: "linear-gradient(135deg, #1a1a1a, #0d0d0d)",
    height: "140px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    borderBottom: "1px solid #1a1a1a",
  },
  posterEmoji: {
    fontSize: "3.5rem",
    filter: "drop-shadow(0 0 20px rgba(229,9,20,0.3))",
  },
  posterGlow: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at 50% 80%, rgba(229,9,20,0.08), transparent 70%)",
  },
  cardBody: {
    padding: "16px",
  },
  cardTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#eee",
    marginBottom: "14px",
    lineHeight: 1.4,
    minHeight: "36px",
  },
  matchLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "10px",
    color: "#555",
    marginBottom: "6px",
    letterSpacing: "0.5px",
  },
  barBg: {
    height: "3px",
    background: "#1f1f1f",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "14px",
  },
  barFill: {
    height: "100%",
    background: "linear-gradient(90deg, #e50914, #ff6b6b)",
    borderRadius: "999px",
    transition: "width 1s ease",
  },
  watchBtn: {
    background: "rgba(229,9,20,0.1)",
    border: "1px solid rgba(229,9,20,0.2)",
    color: "#e50914",
    borderRadius: "8px",
    padding: "8px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    textAlign: "center",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  footer: {
    position: "relative",
    zIndex: 1,
    padding: "0 40px 40px",
  },
  footerDivider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, #1f1f1f, transparent)",
    marginBottom: "28px",
  },
  footerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  footerLogo: {
    fontSize: "16px",
    fontWeight: "900",
    color: "#e50914",
    letterSpacing: "2px",
  },
  footerText: {
    color: "#333",
    fontSize: "12px",
    letterSpacing: "0.5px",
  },
  footerCredit: {
    color: "#444",
    fontSize: "12px",
    letterSpacing: "1px",
  },
};

// Inject spinner animation
const styleTag = document.createElement("style");
styleTag.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleTag);

export default App;