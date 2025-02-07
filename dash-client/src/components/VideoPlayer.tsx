import React, { useEffect, useRef } from "react";
import dashjs from "dashjs";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const qualityCheckInterval = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const player = dashjs.MediaPlayer().create();
      playerRef.current = player;

      // ⚙️ Configuration avancée de l'ABR
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
            bufferTimeAtTopQuality: 20,
            bufferTimeAtTopQualityLongForm: 30,
          },
        },
      });

      // 📺 Initialisation du lecteur avec une vidéo DASH
      player.initialize(videoRef.current, "https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd", true);

      // 🔥 Gestion des erreurs
      player.on(dashjs.MediaPlayer.events.ERROR, (e) => {
        console.error("🚨 Erreur DASH :", e);
      });

      // 🔄 Détection et affichage des changements de qualité
      player.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, (e) => {
        const bitrates = player.getBitrateInfoListFor("video");
        console.log("🔄 Changement de qualité :", {
          mediaType: e.mediaType,
          oldQuality: e.oldQuality,
          newQuality: e.newQuality,
          bitrate: bitrates[e.newQuality]?.bitrate + " kbps",
          resolution: `${bitrates[e.newQuality]?.width}x${bitrates[e.newQuality]?.height}`,
          codec: bitrates[e.newQuality]?.codec,
        });
      });

      // 📊 Affichage des qualités disponibles après chargement
      setTimeout(() => {
        const bitrates = player.getBitrateInfoListFor("video");
        console.log("📺 Qualités vidéo disponibles :");
        bitrates.forEach((b, index) => {
          console.log(`🔹 Qualité ${index}: ${b.height}p (${b.bitrate} kbps) - Codec: ${b.codec}`);
        });

        // 🔍 Vérifier la qualité initiale
        const currentTrack = player.getCurrentTrackFor("video");
        console.log("🎯 Qualité vidéo initiale :", currentTrack);
      }, 2000);

      // ⏳ Surveillance du buffer et adaptation de la qualité
      qualityCheckInterval.current = setInterval(() => {
        if (playerRef.current) {
          const player = playerRef.current;
          const bufferLevel = player.getBufferLength();
          const activeQuality = player.getQualityFor("video");

          console.log(`📡 Qualité actuelle : ${activeQuality} | Buffer : ${bufferLevel}s`);

          // Si le buffer est trop bas, réduire la qualité
          if (bufferLevel < 3) {
            console.warn("⚠️ Buffer faible ! Rétrogradation de la qualité...");
            const newQuality = Math.max(0, activeQuality - 1);
            player.setQualityFor("video", newQuality);
          }

          // Si le buffer est bon, essayer d'augmenter la qualité
          if (bufferLevel > 20 ) {
            console.log("🚀 Buffer stable, on tente d'améliorer la qualité...");
            const maxQuality = player.getBitrateInfoListFor("video").length - 1;
            const newQuality = Math.min(maxQuality, activeQuality + 1);
            player.setQualityFor("video", newQuality);
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
      <h1>📡 Lecteur DASH avec Adaptation Dynamique</h1>
      <video 
        ref={videoRef} 
        controls 
        muted 
        style={{ width: "80%", border: "2px solid black" }}
      />
    </div>
  );
};

export default VideoPlayer;
