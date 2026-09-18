import { useEffect, useState } from "react";
import {
  Heart,
  Music,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";

import { getLovePageById } from "../../services/lovePageService";

import "./PublicLovePage.css";

function PublicLovePage() {
  const [lovePage, setLovePage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  const pageId = window.location.pathname.split("/").pop();

  useEffect(() => {
    async function loadLovePage() {
      try {
        const data = await getLovePageById(pageId);

        if (!data) {
          setError("This LovePage does not exist ❤️");
          return;
        }

        setLovePage(data);
      } catch (error) {
        console.error("Error loading LovePage:", error);
        setError("Could not load this LovePage.");
      } finally {
        setLoading(false);
      }
    }

    loadLovePage();
  }, [pageId]);

  const images = Array.isArray(lovePage?.images) ? lovePage.images : [];

  function closeLightbox() {
    setSelectedImageIndex(null);
  }

  function showNextImage() {
    setSelectedImageIndex((currentIndex) => {
      if (currentIndex === null || images.length === 0) {
        return currentIndex;
      }

      return (currentIndex + 1) % images.length;
    });
  }

  function showPreviousImage() {
    setSelectedImageIndex((currentIndex) => {
      if (currentIndex === null || images.length === 0) {
        return currentIndex;
      }

      return (currentIndex - 1 + images.length) % images.length;
    });
  }

  useEffect(() => {
    function handleKeyboard(event) {
      if (selectedImageIndex === null) {
        return;
      }

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }
    }

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [selectedImageIndex, images.length]);

  if (loading) {
    return <div className="public-loading">Loading your love story ❤️</div>;
  }

  if (error) {
    return (
      <div className="public-error">
        <h2>Oops ❤️</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main
      className={`public-love-page ${!showIntro ? "love-page-opened" : ""}`}
    >
      {/* =========================
          Romantic Intro Screen
      ========================= */}

      {showIntro && (
        <div className="love-intro">
          <div className="intro-glow"></div>

          <div className="intro-card">
            <div className="intro-heart">
              <Heart size={45} fill="currentColor" />
            </div>

            <span className="intro-small-text">A little surprise for you</span>

            <h2>
              Someone made
              <br />
              something special
              <br />
              <span>just for you ❤️</span>
            </h2>

            <p>
              There is a little love story
              <br />
              waiting for you...
            </p>

            <button
              type="button"
              className="intro-open-btn"
              onClick={() => setShowIntro(false)}
            >
              <Heart size={18} fill="currentColor" />
              Open My LovePage
            </button>

            <span className="intro-footer">Made with love ❤️</span>
          </div>
        </div>
      )}

      {/* =========================
          Floating Hearts
      ========================= */}

      <div className="floating-hearts" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} className={`floating-heart heart-${index + 1}`}>
            ❤️
          </span>
        ))}
      </div>

      {/* =========================
          Main LovePage
      ========================= */}

      <div className="public-content">
        <div className="public-badge">
          <Heart size={30} fill="currentColor" />
          <span>Made with love</span>
        </div>

        <h1>
          To my <span>{lovePage.name}</span> ❤️
        </h1>

        <div className="public-divider">
          <Heart size={18} fill="currentColor" />
        </div>

        <p className="public-message">{lovePage.message}</p>

        {/* =========================
            Special Song
        ========================= */}

        {lovePage.songUrl && (
          <section className="song-player">
            <div className="song-cover">
              <Music size={38} />
            </div>

            <div className="song-details">
              <span className="song-label">OUR SPECIAL SONG</span>

              <h3>Our song together 🎵</h3>

              <p>A song that reminds me of you ❤️</p>
            </div>

            <a
              href={lovePage.songUrl}
              target="_blank"
              rel="noreferrer"
              className="song-play-btn"
              aria-label="Listen to our special song on YouTube"
            >
              <Play size={19} fill="currentColor" />
              <span>Listen</span>
            </a>

            <a
              href={lovePage.songUrl}
              target="_blank"
              rel="noreferrer"
              className="song-youtube-link"
            >
              <ExternalLink size={14} />
              Open on YouTube
            </a>
          </section>
        )}

        {/* =========================
            Gallery
        ========================= */}

        {images.length > 0 && (
          <section className="public-gallery">
            {images.map((imageUrl, index) => (
              <button
                type="button"
                className="public-image-card"
                key={`${imageUrl}-${index}`}
                onClick={() => setSelectedImageIndex(index)}
                aria-label={`Open memory ${index + 1}`}
              >
                <img
                  src={imageUrl}
                  alt={`Memory ${index + 1}`}
                  loading="lazy"
                />

                <span className="image-view-hint">
                  <ExternalLink size={14} />
                </span>
              </button>
            ))}
          </section>
        )}

        {/* =========================
            Footer
        ========================= */}

        <div className="public-bottom">
          <Heart size={20} fill="currentColor" />

          <p>Forever and always ❤️</p>

          <span>Made with love</span>
        </div>
      </div>

      {/* =========================
          Lightbox
      ========================= */}

      {selectedImageIndex !== null && images.length > 0 && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close image viewer"
          >
            <X size={28} />
          </button>

          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            onClick={(event) => {
              event.stopPropagation();
              showPreviousImage();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={34} />
          </button>

          <img
            className="lightbox-image"
            src={images[selectedImageIndex]}
            alt={`Memory ${selectedImageIndex + 1}`}
            onClick={(event) => event.stopPropagation()}
          />

          <button
            type="button"
            className="lightbox-nav lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              showNextImage();
            }}
            aria-label="Next image"
          >
            <ChevronRight size={34} />
          </button>

          <div className="lightbox-counter">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </main>
  );
}

export default PublicLovePage;
