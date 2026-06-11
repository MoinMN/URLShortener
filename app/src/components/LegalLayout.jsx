import { Link } from "react-router-dom";

export default function LegalLayout({ eyebrow, title, children }) {
  return (
    <>
      <style>{`
        *{
          box-sizing:border-box;
        }

        body{
          margin:0;
          background:#0a0a0a;
          color:#e8e4dc;
          font-family:'Inter',sans-serif;
          font-weight:300;
        }

        .page{
          min-height:100vh;
          display:flex;
          flex-direction:column;
        }

        nav{
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:28px 48px;
          border-bottom:1px solid rgba(232,228,220,.08);
        }

        .logo{
          text-decoration:none;
          color:#e8e4dc;
          font-size:13px;
          letter-spacing:.18em;
          text-transform:uppercase;
        }

        .content{
          max-width:820px;
          margin:auto;
          width:100%;
          padding:80px 48px;
        }

        .eyebrow{
          font-size:11px;
          letter-spacing:.16em;
          text-transform:uppercase;
          color:rgba(232,228,220,.35);
          margin-bottom:24px;
        }

        h1{
          font-size:clamp(42px,6vw,72px);
          font-weight:300;
          letter-spacing:-.03em;
          margin-bottom:56px;
          line-height:.95;
        }

        h2{
          font-weight:400;
          margin-top:48px;
          margin-bottom:18px;
          font-size:20px;
        }

        p{
          line-height:1.8;
          color:rgba(232,228,220,.75);
          margin-bottom:18px;
        }

        ul{
          color:rgba(232,228,220,.75);
          line-height:1.8;
          padding-left:18px;
        }

        footer{
          margin-top:auto;
          padding:28px 48px;
          border-top:1px solid rgba(232,228,220,.06);
          display:flex;
          justify-content:space-between;
        }

        .footer-links{
          display:flex;
          gap:24px;
        }

        .footer-links a{
          text-decoration:none;
          color:rgba(232,228,220,.35);
          font-size:11px;
          text-transform:uppercase;
          letter-spacing:.1em;
        }

        @media(max-width:768px){
          nav,
          footer{
            padding:20px 24px;
          }

          .content{
            padding:60px 24px;
          }
        }
      `}</style>

      <div className="page">
        <nav>
          <Link className="logo" to="/">
            Snip
          </Link>
        </nav>

        <main className="content">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>

          {children}
        </main>

        <footer>
          <div className="footer-links">
            <Link to="/aboutus">About</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>

          <span
            style={{
              fontSize: "11px",
              color: "rgba(232,228,220,.2)",
            }}
          >
            Snip
          </span>
        </footer>
      </div>
    </>
  );
}
