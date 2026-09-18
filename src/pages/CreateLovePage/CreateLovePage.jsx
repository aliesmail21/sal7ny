import { useState } from "react";
import {
  Heart,
  ImagePlus,
  Send,
  X,
  Copy,
  ExternalLink,
  Music,
  Share2,
} from "lucide-react";

import { createLovePage } from "../../services/lovePageService";
import { uploadImage } from "../../services/cloudinaryService";

import "./CreateLovePage.css";

function CreateLovePage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [songUrl, setSongUrl] = useState("");
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [createdLink, setCreatedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [creatingPage, setCreatingPage] = useState(false);

  // =========================
  // Validation Constants
  // =========================

  const MAX_NAME_LENGTH = 100;
  const MIN_MESSAGE_LENGTH = 10;
  const MAX_MESSAGE_LENGTH = 5000;
  const MAX_IMAGES = 10;
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  // =========================
  // YouTube URL Validation
  // =========================

  function isValidYouTubeUrl(url) {
    if (!url.trim()) {
      return true;
    }

    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();

      return (
        hostname === "youtube.com" ||
        hostname === "www.youtube.com" ||
        hostname === "youtu.be" ||
        hostname === "www.youtu.be" ||
        hostname === "m.youtube.com"
      );
    } catch {
      return false;
    }
  }

  // =========================
  // Image Selection
  // =========================

  function handleImages(event) {
    if (loading) {
      return;
    }

    const files = Array.from(event.target.files);

    if (files.length === 0) {
      return;
    }

    setError("");

    if (images.length + files.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images ❤️`);

      event.target.value = "";
      return;
    }

    const oversizedFile = files.find((file) => file.size > MAX_IMAGE_SIZE);

    if (oversizedFile) {
      setError(
        `"${oversizedFile.name}" is larger than 5MB. Please choose a smaller image.`,
      );

      event.target.value = "";
      return;
    }

    const invalidFile = files.find((file) => !file.type.startsWith("image/"));

    if (invalidFile) {
      setError(`"${invalidFile.name}" is not a valid image file.`);

      event.target.value = "";
      return;
    }

    const newImages = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    event.target.value = "";
  }

  // =========================
  // Remove Image
  // =========================

  function removeImage(imageId) {
    if (loading) {
      return;
    }

    setImages((prevImages) => {
      const imageToRemove = prevImages.find((image) => image.id === imageId);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      return prevImages.filter((image) => image.id !== imageId);
    });

    setError("");
  }

  // =========================
  // Form Validation
  // =========================

  function validateForm() {
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    const trimmedSongUrl = songUrl.trim();

    if (!trimmedName) {
      return "Please enter her name ❤️";
    }

    if (trimmedName.length < 2) {
      return "Her name should be at least 2 characters ❤️";
    }

    if (trimmedName.length > MAX_NAME_LENGTH) {
      return `Her name cannot be longer than ${MAX_NAME_LENGTH} characters ❤️`;
    }

    if (!trimmedMessage) {
      return "Please write your message ❤️";
    }

    if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
      return `Your message should be at least ${MIN_MESSAGE_LENGTH} characters ❤️`;
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return `Your message cannot be longer than ${MAX_MESSAGE_LENGTH} characters ❤️`;
    }

    if (images.length > MAX_IMAGES) {
      return `You can upload a maximum of ${MAX_IMAGES} images ❤️`;
    }

    if (!isValidYouTubeUrl(trimmedSongUrl)) {
      return "Please enter a valid YouTube link 🎵";
    }

    return "";
  }

  // =========================
  // Create LovePage
  // =========================

  async function handleCreateLovePage() {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCopied(false);
      setShared(false);
      setCreatedLink("");
      setUploadProgress(0);
      setCurrentImage(0);
      setCreatingPage(false);

      const imageUrls = [];

      // =========================
      // Upload Images
      // =========================

      for (let index = 0; index < images.length; index++) {
        const image = images[index];

        setCurrentImage(index + 1);
        setUploadProgress(0);

        try {
          const imageUrl = await uploadImage(image.file, (progress) => {
            setUploadProgress(progress);
          });

          imageUrls.push(imageUrl);
        } catch (uploadError) {
          throw new Error(
            `Failed to upload "${image.file.name}". Please try again.`,
          );
        }
      }

      // =========================
      // Create Firestore Document
      // =========================

      setCreatingPage(true);
      setUploadProgress(100);

      const pageId = await createLovePage(
        name.trim(),
        message.trim(),
        imageUrls,
        songUrl.trim(),
      );

      const link = `${window.location.origin}/love/${pageId}`;

      setCreatedLink(link);

      console.log("LovePage created:", pageId);
    } catch (error) {
      console.error("Error creating LovePage:", error);

      setError(
        error.message || "Something went wrong while creating your LovePage.",
      );
    } finally {
      setLoading(false);
      setCreatingPage(false);
    }
  }

  // =========================
  // Copy Link
  // =========================

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(createdLink);

      setCopied(true);
      setError("");

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (error) {
      console.error("Copy failed:", error);

      setError("Could not copy the link. Please copy it manually.");
    }
  }

  // =========================
  // Share LovePage
  // =========================

  async function handleShareLovePage() {
    if (!createdLink) {
      return;
    }

    const shareData = {
      title: `LovePage for ${name}`,
      text: `Someone made a special LovePage just for you ❤️`,
      url: createdLink,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);

        setShared(true);
        setError("");

        setTimeout(() => {
          setShared(false);
        }, 2500);

        return;
      }

      await navigator.clipboard.writeText(createdLink);

      setShared(true);
      setError("");

      setTimeout(() => {
        setShared(false);
      }, 2500);
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      console.error("Share failed:", error);

      setError("Could not share the LovePage. You can copy the link instead.");
    }
  }

  // =========================
  // Open Link
  // =========================

  function handleOpenLink() {
    window.open(createdLink, "_blank");
  }

  return (
    <div className="create-page">
      <header className="create-header">
        <div className="create-logo">
          <Heart size={22} fill="currentColor" />
          LovePage
        </div>

        <span>Create your love story ❤️</span>
      </header>

      <main className="create-layout">
        {/* =========================
            Form
        ========================= */}

        <section className="editor-section">
          <div className="section-heading">
            <span>01 — Your message</span>

            <h1>Create something beautiful.</h1>

            <p>
              Write a message from your heart and add your favorite memories.
            </p>
          </div>

          {/* Name */}

          <div className="form-group">
            <label>Her name</label>

            <input
              type="text"
              placeholder="Enter her name..."
              value={name}
              maxLength={MAX_NAME_LENGTH}
              disabled={loading}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
            />

            <small>
              {name.length}/{MAX_NAME_LENGTH}
            </small>
          </div>

          {/* Message */}

          <div className="form-group">
            <label>Your message</label>

            <textarea
              rows="8"
              placeholder="Write something from your heart..."
              value={message}
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={loading}
              onChange={(e) => {
                setMessage(e.target.value);
                setError("");
              }}
            />

            <small>
              {message.length}/{MAX_MESSAGE_LENGTH}
            </small>
          </div>

          {/* Song */}

          <div className="form-group">
            <label className="form-label-with-icon">
              <Music size={17} />
              Our song
            </label>

            <input
              type="url"
              placeholder="Paste YouTube song link..."
              value={songUrl}
              disabled={loading}
              onChange={(e) => {
                setSongUrl(e.target.value);
                setError("");
              }}
            />

            <small>
              Optional — paste a YouTube link for your favorite song 🎵
            </small>
          </div>

          {/* Images */}

          <div className="form-group">
            <label>Add your memories</label>

            <label
              className={`upload-box ${loading ? "upload-box-disabled" : ""}`}
            >
              <ImagePlus size={28} />

              <span>Upload your photos</span>

              <small>Choose up to {MAX_IMAGES} images — max 5MB each</small>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImages}
                disabled={loading}
                hidden
              />
            </label>
          </div>

          {/* Selected Images */}

          {images.length > 0 && (
            <div className="selected-images">
              <p>{images.length} image(s) selected ❤️</p>

              <div className="selected-images-grid">
                {images.map((image) => (
                  <div className="selected-image-card" key={image.id}>
                    <img src={image.url} alt="Selected memory" />

                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(image.id)}
                      disabled={loading}
                      aria-label="Remove image"
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================
              Upload Progress
          ========================= */}

          {loading && (
            <div className="upload-progress-box">
              <div className="upload-progress-header">
                <span>
                  {creatingPage
                    ? "Creating your LovePage... ❤️"
                    : `Uploading image ${currentImage} of ${images.length}... 📸`}
                </span>

                {!creatingPage && <strong>{uploadProgress}%</strong>}
              </div>

              <div className="upload-progress-track">
                <div
                  className="upload-progress-bar"
                  style={{
                    width: `${uploadProgress}%`,
                  }}
                />
              </div>

              {!creatingPage && (
                <small>
                  Please don't close this page while your memories are
                  uploading.
                </small>
              )}
            </div>
          )}

          {/* =========================
              Success Box
          ========================= */}

          {createdLink && (
            <div className="success-box">
              <div className="success-heart">
                <Heart size={35} fill="currentColor" />
              </div>

              <h3>Your LovePage is ready ❤️</h3>

              <p>Your love story is ready to share.</p>

              <div className="created-link">{createdLink}</div>

              {/* Share */}

              <button
                type="button"
                className="share-link-btn"
                onClick={handleShareLovePage}
              >
                <Share2 size={18} />

                {shared ? "Ready to Share ❤️" : "Share LovePage"}
              </button>

              {/* Copy */}

              <button
                type="button"
                className="copy-link-btn"
                onClick={handleCopyLink}
              >
                <Copy size={17} />

                {copied ? "Link Copied ❤️" : "Copy LovePage Link"}
              </button>

              {/* Open */}

              <button
                type="button"
                className="open-link-btn"
                onClick={handleOpenLink}
              >
                <ExternalLink size={17} />
                Open LovePage
              </button>
            </div>
          )}

          {/* Create */}

          <button
            className="publish-btn"
            onClick={handleCreateLovePage}
            disabled={loading}
          >
            <Send size={18} />

            {loading
              ? creatingPage
                ? "Creating your LovePage..."
                : `Uploading ${currentImage} of ${images.length}...`
              : "Create my LovePage"}
          </button>

          {error && <p className="error-message">{error}</p>}
        </section>

        {/* =========================
            Preview
        ========================= */}

        <section className="preview-section">
          <div className="preview-label">LIVE PREVIEW</div>

          <div className="love-preview">
            <div className="preview-top">
              <Heart size={25} fill="#d84f76" color="#d84f76" />

              <span>Made with love</span>
            </div>

            <h2>
              To my <span>{name || "beautiful love"}</span> ❤️
            </h2>

            <div className="preview-message">
              {message || "Your heartfelt message will appear here..."}
            </div>

            {songUrl.trim() && (
              <div className="preview-song">
                <Music size={18} />

                <span>Our special song 🎵</span>
              </div>
            )}

            {images.length > 0 && (
              <div className="preview-gallery">
                {images.map((image) => (
                  <img key={image.id} src={image.url} alt="Memory" />
                ))}
              </div>
            )}

            <div className="preview-footer">Forever and always ❤️</div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CreateLovePage;
