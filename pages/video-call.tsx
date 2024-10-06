import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

const VideoCallPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const userVideoContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [size, setSize] = useState({ width: 180, height: 180 });

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playVideo = () => {
        video.play().catch(error => {
          console.error("Erreur lors de la lecture automatique :", error);
        });
      };

      const enterFullscreen = () => {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(err => {
            console.error(`Erreur lors du passage en plein écran : ${err.message}`);
          });
        }
      };

      const handleVideoEnd = () => {
        router.push('/'); // Redirige vers la page d'accueil à la fin de la vidéo
      };

      playVideo();
      enterFullscreen();

      video.addEventListener('ended', handleVideoEnd);

      // Demander l'accès à la caméra
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          setStream(stream);
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Erreur lors de l'accès à la caméra :", err);
        });

      return () => {
        video.removeEventListener('ended', handleVideoEnd);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [router]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && userVideoContainerRef.current) {
      const newX = e.clientX - userVideoContainerRef.current.offsetWidth / 2;
      const newY = e.clientY - userVideoContainerRef.current.offsetHeight / 2;
      setPosition({ x: newX, y: newY });
    } else if (isResizing && userVideoContainerRef.current) {
      const newWidth = Math.max(40, e.clientX - position.x);
      const newHeight = Math.max(40, e.clientY - position.y);
      setSize({ width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  return (
    <div 
      className="fixed inset-0 bg-black overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        controls={false}
        loop={false}
        src="/astrolab.mp4"
        style={{
          pointerEvents: 'none',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <div
        ref={userVideoContainerRef}
        className="absolute"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="w-full h-full overflow-hidden rounded-full border-2 border-white shadow-lg">
          <video
            ref={userVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
        </div>
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-full cursor-se-resize"
          onMouseDown={handleResizeStart}
        />
      </div>
    </div>
  );
};

export default VideoCallPage;