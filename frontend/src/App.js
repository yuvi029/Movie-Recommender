import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [movies, setMovies]           = useState([]);
  const [selected, setSelected]       = useState("");
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    axios.get("https://movie-recommender-backend-q93b.onrender.com/movies")
      .then(res => setMovies(res.data.movies))
      .catch(err => console.log(err));
  }, []);

  const recommend = () => {
    if (!selected) return;
    setLoading(true);
    axios.get(`https://movie-recommender-backend-q93b.onrender.com/recommend?movie=${selected}`)
      .then(res => {
        setRecommended(res.data.movies);
        setLoading(false);
      })
      .catch(err => { console.log(err); setLoading(false); });
  };

  return (
    <div style={styles.page}>

      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.badge}>✦ AI Powered</div>
        <h1 style={styles.title}>Movie Recommender</h1>
        <p style={styles.subtitle}>
          Discover films you'll love based on what you already enjoy
        </p>
      </div>

      {/* Search Card */}
      <div style={styles.card}>
        <p style={styles.label}>Choose a movie</p>
        <div style={styles.row}>
          <select
            style={styles.select}
            onChange={e => setSelected(e.target.value)}
            value={selected}
          >
            <option value="">-- Select a Movie --</option>
            {movies.map((movie, idx) => (
              <option key={idx} value={movie}>{movie}</option>
            ))}
          </select>

          <button
            style={{ ...styles.button, ...(loading ? styles.buttonLoading : {}) }}
            onClick={recommend}
            disabled={loading}
          >
            {loading ? <span>⟳ Finding...</span> : "✦ Recommend"}
          </button>
        </div>
      </div>

      {/* Results */}
      {recommended.length > 0 && (
        <div style={styles.resultsSection}>
          <div style={styles.resultsHeader}>
            <div style={styles.line} />
            <p style={styles.resultsTitle}>Top Picks For You</p>
            <div style={styles.line} />
          </div>

          <div style={styles.grid}>
            {recommended.map((movie, idx) => (
              <div
                key={idx}
                style={styles.movieCard}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.borderColor = "#e50914";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(229,9,20,0.3)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#2a2a2a";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)";
                }}
              >
                <div style={styles.rank}>#{idx + 1}</div>
                <div style={styles.poster}>🎬</div>
                <p style={styles.movieTitle}>{movie}</p>
                <div style={styles.matchRow}>
                  <span style={styles.matchLabel}>Match</span>
                  <div style={styles.barBg}>
                    <div style={{ ...styles.barFill, width: `${95 - idx * 7}%` }} />
                  </div>
                  <span style={styles.matchPct}>{95 - idx * 7}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={styles.footerContainer}>
        <div style={styles.footerLine} />
        <p style={styles.footer}>Built with Python · FastAPI · React · TMDB Dataset</p>
        <p style={styles.createdBy}>Created by <span style={styles.name}>YUVRAJ</span></p>
      </div>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#080808",
    color: "#fff",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "60px 20px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute",
    top: "-150px",
    left: "-150px",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(229,9,20,0.15) 0%, transparent 70%)",
    borderRadius: "50%",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute",
    bottom: "-150px",
    right: "-150px",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(229,9,20,0.1) 0%, transparent 70%)",
    borderRadius: "50%",
    pointerEvents: "none",
  },
  hero: {
    marginBottom: "48px",
    position: "relative",
    zIndex: 1,
  },
  badge: {
    display: "inline-block",
    background: "rgba(229,9,20,0.15)",
    border: "1px solid rgba(229,9,20,0.4)",
    color: "#e50914",
    padding: "6px 16px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "1px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "clamp(2.5rem, 6vw, 4rem)",
    fontWeight: "800",
    margin: "0 0 16px",
    background: "linear-gradient(135deg, #fff 40%, #e50914)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#888",
    fontSize: "1.1rem",
    maxWidth: "480px",
    margin: "0 auto",
    lineHeight: "1.6",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "32px",
    maxWidth: "600px",
    margin: "0 auto 60px",
    position: "relative",
    zIndex: 1,
  },
  label: {
    color: "#aaa",
    fontSize: "13px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "16px",
  },
  row: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  select: {
    flex: 1,
    minWidth: "220px",
    padding: "14px 18px",
    fontSize: "15px",
    borderRadius: "12px",
    border: "1px solid #2a2a2a",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
    outline: "none",
  },
  button: {
    padding: "14px 28px",
    fontSize: "15px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #e50914, #b20710)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    letterSpacing: "0.5px",
  },
  buttonLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  resultsSection: {
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  resultsHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "32px",
    justifyContent: "center",
  },
  line: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, transparent, #333)",
  },
  resultsTitle: {
    color: "#aaa",
    fontSize: "13px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    margin: 0,
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  movieCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid #2a2a2a",
    borderRadius: "16px",
    padding: "24px 20px",
    width: "160px",
    cursor: "pointer",
    transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  },
  rank: {
    fontSize: "12px",
    color: "#e50914",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "12px",
    textAlign: "left",
  },
  poster: {
    fontSize: "2.5rem",
    marginBottom: "12px",
  },
  movieTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#eee",
    marginBottom: "16px",
    lineHeight: "1.4",
    minHeight: "36px",
  },
  matchRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  matchLabel: {
    fontSize: "10px",
    color: "#666",
    whiteSpace: "nowrap",
  },
  barBg: {
    flex: 1,
    height: "4px",
    background: "#222",
    borderRadius: "999px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    background: "linear-gradient(90deg, #e50914, #ff6b6b)",
    borderRadius: "999px",
    transition: "width 0.8s ease",
  },
  matchPct: {
    fontSize: "10px",
    color: "#e50914",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  footerContainer: {
    marginTop: "80px",
    position: "relative",
    zIndex: 1,
  },
  footerLine: {
    width: "60%",
    height: "1px",
    background: "linear-gradient(90deg, transparent, #e50914, transparent)",
    margin: "0 auto 24px",
  },
  footer: {
    color: "#333",
    fontSize: "13px",
    marginBottom: "10px",
  },
  createdBy: {
    color: "#555",
    fontSize: "13px",
    letterSpacing: "1px",
  },
  name: {
    color: "#e50914",
    fontWeight: "700",
    letterSpacing: "2px",
  },
};

export default App;