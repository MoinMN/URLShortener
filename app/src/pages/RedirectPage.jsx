import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function RedirectPage() {
  const { code } = useParams();
  const [phase, setPhase] = useState("loading");

  useEffect(() => {
    const redirect = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/${code}`);

        if (res.status === 404) {
          setPhase("notfound");
          return;
        }

        if (res.status === 410) {
          setPhase("notfound");
          return;
        }

        const data = await res.json();

        if (data.longUrl) {
          window.location.replace(data.longUrl);
          return;
        }

        setPhase("notfound");
      } catch (err) {
        console.error(err);
        setPhase("notfound");
      }
    };

    redirect();
  }, [code]);

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
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

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
          color: rgba(232,228,220,0.2);
        }

        .center-stage {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px;
          padding: 80px 48px;
        }

        /* ── Loading state ── */
        .load-wordmark {
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.25);
        }

        .bar-track {
          width: 200px;
          height: 1px;
          background: rgba(232,228,220,0.08);
          position: relative;
          overflow: hidden;
        }

        .bar-fill {
          position: absolute;
          top: 0; left: 0;
          height: 1px;
          background: #e8e4dc;
          animation: barSweep 1.4s ease-in-out infinite;
        }

        @keyframes barSweep {
          0%   { left: -60%; width: 60%; }
          100% { left: 100%; width: 60%; }
        }

        .load-status {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.3);
        }

        .code-chip {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: rgba(232,228,220,0.5);
          background: rgba(232,228,220,0.06);
          padding: 4px 10px;
          letter-spacing: 0.05em;
        }

        /* ── Not found state ── */
        .notfound-headline {
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 300;
          line-height: 0.95;
          letter-spacing: -0.03em;
          color: #e8e4dc;
          text-align: center;
        }

        .notfound-headline em {
          font-style: italic;
          color: rgba(232,228,220,0.3);
        }

        .notfound-sub {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.25);
          text-align: center;
        }

        .home-link {
          display: inline-block;
          border: 1px solid rgba(232,228,220,0.2);
          padding: 14px 28px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #e8e4dc;
          text-decoration: none;
          transition: background 0.15s, border-color 0.15s;
        }

        .home-link:hover {
          background: rgba(232,228,220,0.06);
          border-color: rgba(232,228,220,0.4);
        }

        footer {
          padding: 28px 48px;
          border-top: 1px solid rgba(232,228,220,0.06);
          display: flex;
          justify-content: space-between;
        }

        .footer-note {
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(232,228,220,0.15);
          text-transform: uppercase;
        }

        @media (max-width: 640px) {
          nav { padding: 20px 24px; }
          .center-stage { padding: 56px 24px; }
          footer { padding: 20px 24px; }
        }
      `}</style>

      <div className="page">
        <nav>
          <a href="/" className="logo">
            Snip
          </a>
          <span className="nav-tag">Redirecting</span>
        </nav>

        <main className="center-stage" aria-live="polite">
          {phase === "loading" && (
            <>
              <span className="load-wordmark">Snip</span>
              <div className="bar-track">
                <div className="bar-fill" />
              </div>
              <div className="load-status">
                <span>Following</span>
                <span className="code-chip">{code}</span>
              </div>
            </>
          )}

          {phase === "notfound" && (
            <>
              <h1 className="notfound-headline">
                Link
                <br />
                <em>not found.</em>
              </h1>
              <p className="notfound-sub">
                /{code} doesn't exist or has expired
              </p>
              <a href="/" className="home-link">
                Create a new link
              </a>
            </>
          )}
        </main>

        <footer>
          <span className="footer-note">Snip — URL Shortener</span>
          <span className="footer-note">— 02</span>
        </footer>
      </div>
    </>
  );
}
