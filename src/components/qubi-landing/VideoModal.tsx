import { useEffect, useRef } from "react";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  src?: string;   // Strapi: hero.secondary_button.url
  title?: string; // Strapi: hero.video_modal_title
}

const VideoModal = ({ open, onClose, src, title }: VideoModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";

    const video = videoRef.current;
    if (video) {
      video.currentTime = 0; // always start fresh
      video.play().catch(() => {}); // autoplay block aanaalum error varaadhu
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      if (video) {
        video.pause();
        video.currentTime = 0; // close-la reset
      }
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  return (
    <div
      className={`modal${open ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <div className="modal-head">
          <strong>{title}</strong>
          <button className="modal-close" aria-label="Close video" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="video-placeholder" style={{ padding: 0 }}>
          {src && (
            <video
              ref={videoRef}
              key={src}
              src={src}
              style={{ width: "100%", aspectRatio: "16/9", display: "block" }}
              controls
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;