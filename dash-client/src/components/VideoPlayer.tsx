import React, { useEffect, useRef } from "react";
import dashjs from "dashjs";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const lastQualityChangeTime = useRef(Date.now());
  const qualityCheckInterval = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const player = dashjs.MediaPlayer().create();
      playerRef.current = player;

      // Configuration améliorée de l'ABR
      player.updateSettings({
        streaming: {
          abr: {
            ABRStrategy: "abrDynamic",
            maxBitrate: { video: 5000000 },
            minBitrate: { video: 100000 },
            initialBitrate: { video: 500000 },
          },
          buffer: {
            fastSwitchEnabled: true,
            bufferToKeep: 5,
            bufferTimeAtTopQuality: 15,
            bufferTimeAtTopQualityLongForm: 20,
          },
        },
      });

      player.initialize(videoRef.current, "https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd", true);

      // Gestion des erreurs
      player.on(dashjs.MediaPlayer.events.ERROR, (e) => {
        console.error("🚨 Erreur DASH :", e);
      });

      // Affichage des qualités disponibles
      setTimeout(() => {
        const bitrates = player.getBitrateInfoListFor("video");
        console.log("📺 Qualités vidéo disponibles :", bitrates);
      }, 2000);

      // Gestion des changements de qualité
      player.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, (e) => {
        lastQualityChangeTime.current = Date.now();
        console.log(`🎬 Qualité appliquée : ${e.newQuality}`);
      });

      // Vérification du buffer et ajustement de la qualité
      qualityCheckInterval.current = setInterval(() => {
        if (playerRef.current) {
          const player = playerRef.current;
          const bufferLevel = player.getBufferLength();
          const activeQuality = player.getQualityFor("video");
          const currentTime = Date.now();

          console.log(`📡 Qualité actuelle : ${activeQuality} | Buffer : ${bufferLevel}s`);

          // Si le buffer est trop faible, baisse la qualité
          if (bufferLevel < 3 && currentTime - lastQualityChangeTime.current > 8000) {
            console.warn("⚠️ Buffer bas ! Réduction de la qualité...");
            player.setQualityFor("video", Math.max(0, activeQuality - 1));
          }

          // Si le buffer est stable et reste au-dessus de 20s pendant 10s, on augmente la qualité
          if (bufferLevel > 20 && currentTime - lastQualityChangeTime.current > 10000) {
            console.log("🚀 Buffer stable pendant 10s, on peut augmenter la qualité...");
            const maxQuality = player.getBitrateInfoListFor("video").length - 1;
            player.setQualityFor("video", Math.min(maxQuality, activeQuality + 1));
          }
        }
      }, 5000);

      return () => {
        clearInterval(qualityCheckInterval.current);
        player.destroy();
      };
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>📡 Lecteur DASH avec ABR amélioré</h1>
      <video ref={videoRef} controls muted style={{ width: "80%", border: "2px solid black" }} />
    </div>
  );
};

export default VideoPlayer;
