import { Heart, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <main className="home-main">
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">
              <Sparkles size={16} />
              Made with love
            </div>

            <h1>
              Turn your feelings
              <br />
              into a <span>beautiful page.</span>
            </h1>

            <p>
              Write a heartfelt message, add your favorite memories, and share a
              special link with someone you love.
            </p>

            <Link to="/create" className="primary-btn">
              Create your LovePage
              <ArrowRight size={18} />
            </Link>

            <div className="hero-note">
              <Heart size={15} fill="currentColor" />
              Your story deserves to be remembered.
            </div>
          </div>

          <div className="hero-card">
            <div className="card-decoration">♡</div>

            <div className="letter-card">
              <span className="letter-label">A little message for you</span>

              <h2>My Love ❤️</h2>

              <p>
                Every memory with you is a beautiful story waiting to be told.
              </p>

              <div className="letter-line" />

              <span className="letter-signature">Yours, always ♡</span>
            </div>

            <div className="floating-heart heart-one">♥</div>
            <div className="floating-heart heart-two">♥</div>
          </div>
        </section>

        <section className="features">
          <div>
            <span>01</span>
            <h3>Write your message</h3>
            <p>Say what is in your heart.</p>
          </div>

          <div>
            <span>02</span>
            <h3>Add your memories</h3>
            <p>Upload your favorite photos.</p>
          </div>

          <div>
            <span>03</span>
            <h3>Share the love</h3>
            <p>Send a personal link.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
