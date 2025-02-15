import React, { useEffect, useRef } from "react";
import dashjs from "dashjs";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const qualityCheckInterval = useRef(null);
  const stableQualityTime = useRef(0); // Temps passé avec une qualité stable
  const lastQuality = useRef(0); // Stocke la dernière qualité appliquée

  useEffect(() => {
    if (videoRef.current) {
      const player = dashjs.MediaPlayer().create();
      playerRef.current = player;

      // Configuration avancée de l'ABR
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
            bufferTimeAtTopQuality: 200,
            bufferTimeAtTopQualityLongForm: 300,
          },
        },
      });

      player.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: false } } } });

      // ############# Initialisation du lecteur avec une vidéo DASH (on met l'ip du serveur) #######################
      // player.initialize(videoRef.current, "http://192.168.100.208:3000/manifest.mpd", true); 
      //----- si vous avez deja un serveur , commentez la ligne suivante et decommentez celle d'en haut , celle-ci va utiliser une videos dash en ligne de test
      player.initialize(videoRef.current, "https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd", true);

      // ici onétection et affichage des changements de qualité
      player.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, (e) => {
        const bitrates = player.getBitrateInfoListFor("video");
        console.log("QUALITES VIDEOS DISPO ",bitrates);
        console.log("🎬 Qualité appliquée :", e.newQuality);
        lastQuality.current = e.newQuality; 
        stableQualityTime.current = 0; 
      });

      qualityCheckInterval.current = setInterval(() => {
        if (playerRef.current) {
          const player = playerRef.current;
          const bufferLevel = player.getBufferLength();
          const activeQuality = player.getQualityFor("video");
          const maxQuality = player.getBitrateInfoListFor("video").length - 1;

          console.log(`📡 Qualité actuelle : ${activeQuality} | Buffer : ${bufferLevel}s`);

          // i le buffer est trop bas, on réduit immédiatement la qualité
          if (bufferLevel < 0.5) {
            console.warn("⚠️ Buffer faible ! Rétrogradation de la qualité...");
            const newQuality = Math.max(0, activeQuality - 1);
            player.setQualityFor("video", newQuality);
            stableQualityTime.current = 0; // Reset du temps stable
          }

          // si le buffer est stable pendant 15 secondes, on peut essayer d'augmenter
          else if (bufferLevel > 15) {
            stableQualityTime.current += 5; // On ajoute le temps du check (5s)
            if (stableQualityTime.current >= 90 && activeQuality < maxQuality) {
              console.log("Buffer stable pendant 15s, amélioration de la qualité...");
              // const newQuality = activeQuality + 1;

              const newQuality = Math.min(activeQuality + 1, lastQuality.current + 1); // Augmente d'une seule étape max
              player.setQualityFor("video", newQuality);

              // player.setQualityFor("video", newQuality);
              stableQualityTime.current = 0; // On remet à zéro le compteur
            }
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
      <h1> Lecteur DASH avec Stabilisation</h1>
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