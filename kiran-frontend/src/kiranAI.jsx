import { useState } from "react";


const API_URL = "https://panduai-backend.onrender.com";

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a1a 0%, #0f0f2d 50%, #0a0a1a 100%)",
    display: "flex", justifyContent: "center", alignItems: "center",
    fontFamily: "'Segoe UI', Arial, sans-serif", color: "white", padding: "20px",
  },
  card: {
    width: "100%", maxWidth: "680px",
    background: "linear-gradient(160deg, #0b0b1f 0%, #10102a 100%)",
    border: "1px solid #7c3aed44", borderRadius: "20px", padding: "35px 30px",
    textAlign: "center", boxShadow: "0 0 60px #7c3aed33, 0 0 120px #7c3aed11",
  },
  title: { fontSize: "2.4rem", fontWeight: 900, color: "#a78bfa", margin: "0 0 4px 0", textShadow: "0 0 20px #a78bfaaa", letterSpacing: "1px" },
  subtitle: { color: "#c4b5fd", fontSize: "0.9rem", marginBottom: "28px", opacity: 0.8 },
  modeButton: {
    padding: "18px", border: "1px solid #7c3aed55", borderRadius: "14px", cursor: "pointer",
    fontSize: "14px", fontWeight: 700, background: "#0f0f25", color: "white",
    width: "100%", marginBottom: "12px", textAlign: "left", transition: "all 0.2s",
  },
  button: {
    padding: "13px 28px", border: "none", borderRadius: "10px", cursor: "pointer",
    fontSize: "15px", fontWeight: 700, background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    color: "white", letterSpacing: "0.5px", boxShadow: "0 4px 15px #7c3aed66", width: "100%",
  },
  backButton: {
    padding: "10px 20px", border: "1px solid #7c3aed88", borderRadius: "10px", cursor: "pointer",
    fontSize: "14px", fontWeight: 700, background: "transparent", color: "#a78bfa", width: "100%", marginTop: "12px",
  },
  textarea: {
    width: "100%", padding: "11px 14px", marginBottom: "16px", borderRadius: "10px",
    border: "1px solid #7c3aed55", background: "#0a0a1a", color: "white", fontSize: "15px",
    outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: "80px",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  resultBox: {
    marginTop: "16px", background: "#0a0a20", border: "1px solid #7c3aed66",
    padding: "18px", borderRadius: "12px", textAlign: "left",
  },
  angerMeter: { width: "100%", height: "14px", background: "#0a0a1a", borderRadius: "7px", overflow: "hidden", marginTop: "8px" },
  chatBubbleAI: {
    background: "#0f0f25", border: "1px solid #7c3aed44", borderRadius: "14px 14px 14px 0",
    padding: "12px 16px", marginBottom: "10px", textAlign: "left", fontSize: "0.95rem", lineHeight: "1.5", color: "#e0d9ff",
  },
  chatBubbleUser: {
    background: "#1a1a35", border: "1px solid #7c3aed66", borderRadius: "14px 14px 0 14px",
    padding: "12px 16px", marginBottom: "10px", textAlign: "right", fontSize: "0.95rem", color: "white",
  },
  divider: { borderColor: "#7c3aed22", margin: "22px 0" },
  emoji: { fontSize: "3rem", display: "block", marginBottom: "6px" },
  label: { display: "block", textAlign: "left", fontSize: "0.75rem", color: "#a78bfa", marginBottom: "5px", letterSpacing: "0.5px", textTransform: "uppercase" },
  warningBox: { background: "#1a0a0a", border: "1px solid #c0392b66", borderRadius: "10px", padding: "12px", marginTop: "10px", textAlign: "left" },
  successBox: { background: "#0a1a0a", border: "1px solid #27ae6066", borderRadius: "10px", padding: "12px", marginTop: "10px", textAlign: "left" },
  statBox: { background: "#0f0f25", border: "1px solid #7c3aed33", borderRadius: "12px", padding: "16px", marginBottom: "14px", textAlign: "left" },
  statLabel: { fontSize: "0.7rem", color: "#a78bfa", textTransform: "uppercase", letterSpacing: "1px" },
  statValue: { fontSize: "2rem", fontWeight: 800, color: "#a78bfa" },
};

const getMeterColor = (score) => {
  if (score >= 70) return "linear-gradient(90deg, #c0392b, #ff0000)";
  if (score >= 40) return "linear-gradient(90deg, #e67e22, #f39c12)";
  return "linear-gradient(90deg, #27ae60, #2ecc71)";
};

export default function KiranAI({ onBack }) {
  const [mode, setMode] = useState("home");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [situation, setSituation] = useState("");
  const [kiranResult, setKiranResult] = useState(null);

  const [message, setMessage] = useState("");
  const [lalithResult, setLalithResult] = useState(null);

  const [panduMessage, setPanduMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const askKiranAI = async () => {
    if (!situation.trim()) return;
    setLoading(true); setError(""); setKiranResult(null);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation }),
      });
      const data = await res.json();
      setKiranResult(data);
    } catch (e) { setError("Cannot connect to KiranAI server 😤 Check your API URL!"); }
    setLoading(false);
  };

  const checkLalithMessage = async () => {
    if (!message.trim()) return;
    setLoading(true); setError(""); setLalithResult(null);
    try {
      const res = await fetch(`${API_URL}/check-message`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setLalithResult(data);
    } catch (e) { setError("Cannot connect to KiranAI server 😤 Check your API URL!"); }
    setLoading(false);
  };

  const chatWithPandu = async () => {
    if (!panduMessage.trim()) return;
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_URL}/chat-pandu`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: panduMessage }),
      });
      const data = await res.json();
      setChatHistory((prev) => [...prev, { user: panduMessage, reply: data.reply }]);
      setPanduMessage("");
    } catch (e) { setError("Cannot connect to Pandu AI 😤"); }
    setLoading(false);
  };

  // HOME
  if (mode === "home") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          {onBack && (
            <button style={{ ...styles.backButton, marginBottom: "16px", marginTop: 0 }} onClick={onBack}>
              ← Back to Menu
            </button>
          )}
          <span style={styles.emoji}>👑</span>
          <h1 style={styles.title}>KiranAI</h1>
          <p style={styles.subtitle}>Trained on Real Data · Powered by ML Model</p>

          <button style={styles.modeButton} onClick={() => setMode("kiran")}>
            <div style={{ fontSize: "1.5rem" }}>👑</div>
            <div style={{ fontWeight: 800, marginTop: "4px", color: "#a78bfa" }}>I am Kiran</div>
            <div style={{ fontSize: "0.8rem", color: "#c4b5fd", marginTop: "2px" }}>Tell what Lalith did → Get advice + punishment 😤</div>
          </button>

          <button style={styles.modeButton} onClick={() => setMode("lalith")}>
            <div style={{ fontSize: "1.5rem" }}>😭</div>
            <div style={{ fontWeight: 800, marginTop: "4px", color: "#a78bfa" }}>I am Lalith</div>
            <div style={{ fontSize: "0.8rem", color: "#c4b5fd", marginTop: "2px" }}>Type your message → Check if it's safe to send 💀</div>
          </button>

         
        </div>
      </div>
    );
  }

  // KIRAN MODE
  if (mode === "kiran") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <span style={styles.emoji}>👑</span>
          <h1 style={styles.title}>Kiran Mode</h1>
          <p style={styles.subtitle}>Tell me what Lalith did 😤</p>
          <label style={styles.label}>Situation</label>
          <textarea
            style={styles.textarea}
            placeholder="E.g. He called me Pandu again 😤"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
          />
          <button style={{ ...styles.button, opacity: loading ? 0.6 : 1 }} onClick={askKiranAI} disabled={loading}>
            {loading ? "Thinking... 💭" : "Get Advice 😤"}
          </button>

          {error && <div style={styles.warningBox}><span style={{ color: "#ff6b6b" }}>⚠️ {error}</span></div>}

          {kiranResult && (
            <div style={styles.resultBox}>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Kiran's Anger Level</div>
                <div style={styles.statValue}>{kiranResult.anger_score ?? "?"}%</div>
                <div style={styles.angerMeter}>
                  <div style={{ height: "100%", width: `${kiranResult.anger_score ?? 0}%`, background: getMeterColor(kiranResult.anger_score ?? 0), borderRadius: "7px", transition: "width 0.5s" }} />
                </div>
              </div>
              {kiranResult.advice && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={styles.statLabel}>Advice</div>
                  <p style={{ color: "#e0d9ff", marginTop: "6px" }}>{kiranResult.advice}</p>
                </div>
              )}
              {kiranResult.punishment && (
                <div style={styles.warningBox}>
                  <div style={styles.statLabel}>😤 Punishment for Lalith</div>
                  <p style={{ color: "#ff8888", marginTop: "6px" }}>{kiranResult.punishment}</p>
                </div>
              )}
            </div>
          )}

          <hr style={styles.divider} />
          <button style={styles.backButton} onClick={() => { setMode("home"); setKiranResult(null); setSituation(""); }}>← Back</button>
        </div>
      </div>
    );
  }

  // LALITH MODE
  if (mode === "lalith") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <span style={styles.emoji}>😭</span>
          <h1 style={styles.title}>Lalith Mode</h1>
          <p style={styles.subtitle}>Check if your message is safe to send 💀</p>
          <label style={styles.label}>Your Message</label>
          <textarea
            style={styles.textarea}
            placeholder="E.g. Hi Pandu how are you 😅"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button style={{ ...styles.button, opacity: loading ? 0.6 : 1 }} onClick={checkLalithMessage} disabled={loading}>
            {loading ? "Checking... 💭" : "Check Message 💀"}
          </button>

          {error && <div style={styles.warningBox}><span style={{ color: "#ff6b6b" }}>⚠️ {error}</span></div>}

          {lalithResult && (
            <div style={styles.resultBox}>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Danger Level</div>
                <div style={styles.statValue}>{lalithResult.danger_score ?? "?"}%</div>
                <div style={styles.angerMeter}>
                  <div style={{ height: "100%", width: `${lalithResult.danger_score ?? 0}%`, background: getMeterColor(lalithResult.danger_score ?? 0), borderRadius: "7px", transition: "width 0.5s" }} />
                </div>
              </div>
              {lalithResult.safe === false ? (
                <div style={styles.warningBox}>
                  <div style={styles.statLabel}>⚠️ WARNING — Don't Send!</div>
                  <p style={{ color: "#ff8888", marginTop: "6px" }}>{lalithResult.reason}</p>
                </div>
              ) : (
                <div style={styles.successBox}>
                  <div style={styles.statLabel}>✅ Looks Safe</div>
                  <p style={{ color: "#88ff88", marginTop: "6px" }}>{lalithResult.reason ?? "Should be okay to send 😌"}</p>
                </div>
              )}
            </div>
          )}

          <hr style={styles.divider} />
          <button style={styles.backButton} onClick={() => { setMode("home"); setLalithResult(null); setMessage(""); }}>← Back</button>
        </div>
      </div>
    );
  }
}
