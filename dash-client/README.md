# README - Client DASH

## Description

Ce répertoire contient le code source et les configurations nécessaires pour mettre en œuvre le **client DASH** du projet de streaming adaptatif. Le client est basé sur **React** et utilise la bibliothèque **Dash.js** pour lire le flux vidéo adaptatif. Il implémente un algorithme personnalisé pour ajuster dynamiquement la qualité du flux en fonction des conditions réseau.

Le client communique avec le serveur DASH pour télécharger les segments vidéo appropriés et garantir une expérience utilisateur fluide, même sous des conditions réseau fluctuantes.

---

## Structure du Répertoire

Voici l'arborescence du répertoire :

```
dash-client/
├── src/
│   ├── VideoPlayer.js
│   └── ...
├── public/
├── node_modules/
├── .gitignore
├── Dockerfile
├── package-lock.json
├── package.json
├── README.MD
```

### Description des Fichiers et Répertoires

- **src/** : Contient les fichiers source principaux du client React.
  - **VideoPlayer.js** : Composant principal responsable de la lecture du flux vidéo et de l'adaptation dynamique de la qualité.
- **public/** : Répertoire contenant les fichiers statiques (par exemple, `index.html`).
- **node_modules/** : Répertoire contenant les dépendances Node.js installées automatiquement via `npm install`.
- **.gitignore** : Fichier spécifiant les fichiers ou répertoires à ignorer par Git.
- **Dockerfile** : Configuration pour construire l'image Docker du client.
- **package-lock.json** & **package.json** : Fichiers de configuration pour les dépendances Node.js.
- **README.MD** : Ce fichier.

---

## Instructions d'Installation et de Lancement

### Prérequis

Assurez-vous d'avoir les outils suivants installés :

- **Docker** (version 20.10 ou supérieure)
- **Node.js** (version 18 ou supérieure)

---

### Étapes de Déploiement

1. **Clonez le dépôt** :
   ```bash
   cd votre-repo/dash-client
   ```

2. **Construisez l'image Docker** :
   ```bash
   docker build -t dash-client .
   ```

3. **Démarrez le conteneur** :
   ```bash
   docker run -d --name dash-client -p 5173:5173 dash-client
   ```

4. **Vérifiez que le client est opérationnel** :
   Accédez à [http://localhost:5173](http://localhost:5173) dans votre navigateur. Vous devriez voir une interface avec un lecteur vidéo configuré pour lire le flux DASH.

---

## Fonctionnalités Clés

1. **Lecture DASH avec Dash.js** :
   - Le client utilise Dash.js pour interpréter le fichier MPD et gérer le téléchargement des segments vidéo.

2. **Algorithme d'Adaptation Personnalisé** :
   - L'algorithme surveille régulièrement le niveau du buffer et ajuste la qualité du flux vidéo en fonction des conditions réseau.
   - Il inclut une logique de stabilisation pour éviter les changements fréquents de qualité.

3. **Interface Utilisateur** :
   - Une interface simple et intuitive permet aux utilisateurs de visualiser le flux vidéo directement dans leur navigateur.

---

## Configuration de l'Algorithme d'Adaptation

L'algorithme d'adaptation repose sur les paramètres suivants :

- **Réduction de Qualité** :
  - Si le buffer descend en dessous de 3 secondes, la qualité est immédiatement abaissée pour éviter les interruptions.
  
- **Augmentation de Qualité** :
  - Si le buffer reste stable pendant plus de 15 secondes, la qualité peut être augmentée progressivement jusqu'à atteindre la meilleure résolution disponible.

Ces paramètres sont configurés dans le fichier `VideoPlayer.js`.

---

## Exemple de Code Clé

Voici un extrait du composant `VideoPlayer.js` montrant l'initialisation du lecteur Dash.js :

```javascript
import React, { useEffect, useRef } from "react";
import dashjs from "dashjs";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

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
        },
      });

      // Initialisation du lecteur
      player.initialize(
        videoRef.current,
        "http://localhost:3000/manifest.mpd",
        true
      );

      return () => {
        player.destroy();
      };
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Streaming Adaptatif DASH</h1>
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
```

---

## Contributions

Les contributions sont les bienvenues ! Pour contribuer, suivez ces étapes :

1. Clonez le dépôt.
2. Créez une branche pour vos modifications (`git checkout -b feature/nom-de-votre-feature`).
3. Soumettez vos changements (`git commit -m "Description de votre modification"`).
4. Envoyez une pull request.


## Remerciements

Nous remercions l'équipe enseignante du Master 1 Génie Informatique pour leur soutien et leurs précieux conseils tout au long de ce projet.

---

Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter ! 😊