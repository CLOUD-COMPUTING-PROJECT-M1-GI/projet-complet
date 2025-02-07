import React, { useEffect, useRef } from "react";
import dashjs from "dashjs";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null); // Pour stocker l'instance du player

  useEffect(() => {
    if (videoRef.current) {
      const player = dashjs.MediaPlayer().create();
      playerRef.current = player; // Stocker le player dans la ref
      
      // Configuration ABR optimisée
      player.updateSettings({
        streaming: {
          abr: {
            ABRStrategy: "abrDynamic", // Stratégie dynamique
            maxBitrate: { video: 5000000 },
            minBitrate: { video: 100000 },
            initialBitrate: { video: 100000 },
          },
          buffer: {
            fastSwitchEnabled: true, // Permet des changements rapides
            bufferPruningInterval: 1,
          }
        }
      });

      // Gestion des erreurs
      player.on(dashjs.MediaPlayer.events.ERROR, (e) => {
        console.error("🚨 Erreur DASH :", e);
      });

      // Détection des changements de qualité
      player.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, (e) => {
        console.log("🔄 Changement de qualité :", {
          mediaType: e.mediaType,
          oldQuality: e.oldQuality,
          newQuality: e.newQuality,
          bitrate: player.getBitrateInfoListFor("video")[e.newQuality]?.bitrate + " kbps",
        });
      });

      // Initialisation du player
      player.initialize(videoRef.current, "http://192.168.79.159:3000/manifest.mpd", true);

      // Récupération des qualités disponibles après chargement
      setTimeout(() => {
        const bitrates = player.getBitrateInfoListFor("video");
        console.log("📺 Qualités vidéo disponibles :");
        bitrates.forEach((b, index) => {
          console.log(`🔹 Qualité ${index}: ${b.height}p (${b.bitrate} kbps) - Codec: ${b.codec}`);
        });

        // Vérifier la qualité actuelle
        const currentTrack = player.getCurrentTrackFor("video");
        console.log("🎯 Qualité vidéo actuelle :", currentTrack);
      }, 2000);

      // Surveiller dynamiquement la qualité active toutes les 5s
      const interval = setInterval(() => {
        if (playerRef.current) {
          const activeQuality = playerRef.current.getQualityFor("video");
          console.log(`📡 Qualité active : ${activeQuality}`);
        }
      }, 5000);

      return () => {
        clearInterval(interval);
        player.destroy();
      };
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Lecteur DASH avec React</h1>
      <video 
        ref={videoRef} 
        controls 
        muted // Nécessaire pour l'autoplay dans certains navigateurs
        style={{ width: "80%", border: "2px solid black" }}
      />
    </div>
  );
};

export default VideoPlayer;
