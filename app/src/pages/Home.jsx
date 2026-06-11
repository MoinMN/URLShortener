import { useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [expiry, setExpiry] = useState(0);
  const [customExpiry, setCustomExpiry] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const inputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL + "/shorten";

  const createShortUrl = async () => {
    if (!longUrl.trim()) {
      setMessage({ text: "Paste a URL to shorten.", type: "error" });
      return;
    }
    const finalExpiry = customExpiry ? Number(customExpiry) : expiry;
    if (!finalExpiry) {
      setMessage({
        text: "Please select or enter an expiry time.",
        type: "error",
      });
      return;
    }
    setMessage({ text: "", type: "" });
    setShortUrl("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl, expiryMinutes: finalExpiry }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({
          text: data.message || "Error creating URL.",
          type: "error",
        });
        return;
      }
      setShortUrl(data.shortUrl);
      setMessage({ text: data.message || "URL created.", type: "success" });
    } catch {
      setMessage({ text: "Server error. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") createShortUrl();
  };

  const EXPIRY_OPTIONS = [
    { label: "30 min", value: 30 },
    { label: "1 hr", value: 60 },
    { label: "6 hr", value: 360 },
    { label: "1 day", value: 1440 },
    { label: "7 days", value: 10080 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0a0a0a;
          color: #e8e4dc;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.8s ease both;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* ── NAV ── */
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 48px;
          border-bottom: 1px solid rgba(232,228,220,0.08);
        }
        .logo {
          font-size: 13px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #e8e4dc;
          text-decoration: none;
          font-weight: 400;
        }
        .nav-tag {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.35);
        }

        /* ── LOADER OVERLAY ── */
        .loader-overlay {
          position: fixed;
          inset: 0;
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 100;
          gap: 32px;
          transition: opacity 0.5s ease, visibility 0.5s ease;
          opacity: ${loading ? 1 : 0};
          visibility: ${loading ? "visible" : "hidden"};
          pointer-events: ${loading ? "all" : "none"};
        }
        .loader-wordmark {
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.3);
        }
        .loader-bar-track {
          width: 200px;
          height: 1px;
          background: rgba(232,228,220,0.1);
          position: relative;
          overflow: hidden;
        }
        .loader-bar-fill {
          position: absolute;
          top: 0; left: 0;
          height: 1px;
          background: #e8e4dc;
          animation: ${loading ? "barSweep 1.2s ease-in-out infinite" : "none"};
        }
        @keyframes barSweep {
          0%   { left: -60%; width: 60%; }
          100% { left: 100%; width: 60%; }
        }
        .loader-status {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.4);
        }

        /* ── HERO ── */
        .hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px 48px 60px;
          max-width: 880px;
        }
        .eyebrow {
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.35);
          margin-bottom: 36px;
        }
        .headline {
          font-size: clamp(48px, 7vw, 88px);
          font-weight: 300;
          line-height: 0.95;
          letter-spacing: -0.03em;
          color: #e8e4dc;
          margin-bottom: 56px;
        }
        .headline em {
          font-style: italic;
          color: rgba(232,228,220,0.45);
        }

        /* ── INPUT BLOCK ── */
        .input-block {
          display: flex;
          flex-direction: column;
          gap: 0;
          max-width: 640px;
        }

        .input-row {
          display: flex;
          border: 1px solid rgba(232,228,220,0.15);
          transition: border-color 0.2s;
        }
        .input-row:focus-within {
          border-color: rgba(232,228,220,0.5);
        }
        .url-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 18px 24px;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          font-weight: 300;
          color: #e8e4dc;
          letter-spacing: 0.02em;
        }
        .url-input::placeholder { color: rgba(232,228,220,0.2); }

        .shorten-btn {
          background: #e8e4dc;
          border: none;
          padding: 18px 28px;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0a0a0a;
          cursor: pointer;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .shorten-btn:hover { background: #ffffff; }
        .shorten-btn:active { background: rgba(232,228,220,0.8); }

        /* ── EXPIRY ROW ── */
        .expiry-row {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1px solid rgba(232,228,220,0.08);
          border-top: none;
          background: rgba(232,228,220,0.02);
        }
        .expiry-label {
          padding: 12px 20px;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.25);
          white-space: nowrap;
          border-right: 1px solid rgba(232,228,220,0.06);
        }
        .expiry-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          flex: 1;
        }
        .expiry-pill {
          background: transparent;
          border: none;
          border-right: 1px solid rgba(232,228,220,0.06);
          padding: 12px 16px;
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.3);
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .expiry-pill:last-child { border-right: none; }
        .expiry-pill:hover { color: #e8e4dc; background: rgba(232,228,220,0.04); }
        .expiry-pill.active {
          color: #e8e4dc;
          background: rgba(232,228,220,0.07);
        }

        /* ── CUSTOM EXPIRY ROW ── */
        .custom-expiry-row {
          display: flex;
          align-items: center;
          border: 1px solid rgba(232,228,220,0.08);
          border-top: none;
          background: rgba(232,228,220,0.02);
        }
        .custom-expiry-label {
          padding: 12px 20px;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.25);
          white-space: nowrap;
          border-right: 1px solid rgba(232,228,220,0.06);
        }
        .custom-expiry-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 12px 20px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 300;
          color: #e8e4dc;
          letter-spacing: 0.04em;
          min-width: 0;
        }
        .custom-expiry-input::placeholder { color: rgba(232,228,220,0.18); }
        .custom-expiry-input::-webkit-outer-spin-button,
        .custom-expiry-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .custom-expiry-input[type=number] { -moz-appearance: textfield; }
        .custom-expiry-unit {
          padding: 12px 20px;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.2);
          white-space: nowrap;
          border-left: 1px solid rgba(232,228,220,0.06);
        }

        /* ── MESSAGE LINE ── */
        .message-line {
          padding: 10px 0 0;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: ${message.type === "error" ? "rgba(220,100,80,0.8)" : "rgba(80,200,120,0.8)"};
          min-height: 28px;
        }

        /* ── RESULT ── */
        .result-block {
          margin-top: 2px;
          display: flex;
          align-items: stretch;
          border: 1px solid rgba(232,228,220,0.08);
          background: rgba(232,228,220,0.03);
          opacity: ${shortUrl ? 1 : 0};
          transform: ${shortUrl ? "translateY(0)" : "translateY(8px)"};
          transition: opacity 0.4s ease, transform 0.4s ease;
          pointer-events: ${shortUrl ? "all" : "none"};
          max-width: 640px;
        }
        .result-url {
          flex: 1;
          padding: 16px 24px;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          font-weight: 300;
          color: #e8e4dc;
          letter-spacing: 0.02em;
          text-decoration: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          align-items: center;
        }
        .result-url:hover { color: #ffffff; }
        .copy-btn {
          background: transparent;
          border: none;
          border-left: 1px solid rgba(232,228,220,0.08);
          padding: 14px 20px;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${copied ? "rgba(80,200,120,0.8)" : "rgba(232,228,220,0.35)"};
          cursor: pointer;
          transition: color 0.15s;
          white-space: nowrap;
        }
        .copy-btn:hover {
          color: ${copied ? "rgba(80,200,120,0.8)" : "#e8e4dc"};
        }

        /* ── FOOTER ── */
        footer {
          padding: 32px 48px;
          border-top: 1px solid rgba(232, 228, 220, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .footer-note {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(232, 228, 220, 0.2);
        }

        .footer-links {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .footer-links a {
          text-decoration: none;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(232, 228, 220, 0.28);
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: rgba(232, 228, 220, 0.9);
        }

        .footer-counter {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: rgba(232, 228, 220, 0.15);
        }

        /* Mobile */

        @media (max-width: 640px) {
          footer {
            padding: 24px;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .footer-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .footer-links {
            flex-wrap: wrap;
            gap: 14px;
          }
        }
      `}</style>

      {/* Loader overlay */}
      <div className="loader-overlay" aria-live="polite" aria-busy={loading}>
        <span className="loader-wordmark">Snip</span>
        <div className="loader-bar-track">
          <div className="loader-bar-fill" />
        </div>
        <span className="loader-status">Shortening</span>
      </div>

      <div className="page">
        <nav>
          <a href="/" className="logo">
            Snip
          </a>
          <span className="nav-tag">URL Shortener</span>
        </nav>

        <main className="hero">
          <p className="eyebrow">Simple. Fast. Clean.</p>

          <h1 className="headline">
            Long URLs,
            <br />
            <em>made short.</em>
          </h1>

          <div className="input-block">
            {/* URL input + Shorten button */}
            <div className="input-row">
              <input
                ref={inputRef}
                className="url-input"
                type="url"
                value={longUrl}
                onChange={(e) => {
                  setLongUrl(e.target.value);
                  setMessage({ text: "", type: "" });
                }}
                onKeyDown={handleKeyDown}
                placeholder="https://your-very-long-url.com/goes/here"
                aria-label="Long URL to shorten"
              />
              <button className="shorten-btn" onClick={createShortUrl}>
                Shorten
              </button>
            </div>

            {/* Expiry selector */}
            <div className="expiry-row" role="group" aria-label="Link expiry">
              <span className="expiry-label">Expires</span>
              <div className="expiry-pills">
                {EXPIRY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`expiry-pill${expiry === opt.value ? " active" : ""}`}
                    onClick={() => {
                      setExpiry(opt.value);
                      setCustomExpiry("");
                    }}
                    aria-pressed={expiry === opt.value}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom expiry */}
            <div className="custom-expiry-row">
              <span className="custom-expiry-label">Custom</span>
              <input
                className="custom-expiry-input"
                type="number"
                min="1"
                value={customExpiry}
                placeholder="e.g. 2880"
                onChange={(e) => {
                  setCustomExpiry(e.target.value);
                  setExpiry(0);
                }}
                aria-label="Custom expiry in minutes"
              />
              <span className="custom-expiry-unit">minutes</span>
            </div>

            {/* Message (error or success) */}
            {message.text && (
              <p className="message-line" role="status">
                {message.text}
              </p>
            )}

            {/* Result */}
            <div className="result-block" aria-live="polite">
              <a
                href={shortUrl}
                className="result-url"
                target="_blank"
                rel="noreferrer"
                tabIndex={shortUrl ? 0 : -1}
              >
                {shortUrl}
              </a>
              <button
                className="copy-btn"
                onClick={handleCopy}
                aria-label="Copy short URL"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </main>

        <footer>
          <div className="footer-left">
            <span className="footer-note">No account needed</span>

            <div className="footer-links">
              <a href="/aboutus">About</a>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
          </div>
          <span className="footer-counter">AWS • SERVERLESS</span>
        </footer>
      </div>
    </>
  );
}
