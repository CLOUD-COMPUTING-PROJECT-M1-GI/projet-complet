# README

## Projet de Cloud Computing - Système de Streaming Adaptatif Conteneurisé

### Description du Projet

Ce dépôt contient le code source et les configurations nécessaires pour mettre en œuvre un système de streaming adaptatif basé sur **DASH (Dynamic Adaptive Streaming over HTTP)**. Le projet est conteneurisé avec **Docker**, et il inclut une stack de surveillance complète avec **Prometheus** et **Grafana** pour monitorer les performances réseau et système.

Le système simule des variations de bande passante et de latence à l'aide de l'outil `tc` afin de tester la robustesse de notre algorithme d'adaptation personnalisé, qui ajuste dynamiquement la qualité du flux vidéo en fonction des conditions réseau.

---

## Auteurs

- **Groupe 1 - Master 1 Génie Informatique (M1-GI)**
- Contact : Arthur Donfack (`donfackarthur750@gmail.com`)

---

## Structure du Projet

Voici l'arborescence du dépôt :

```
.
├── .idea
├── dash-client
│   ├── Dockerfile
│   ├── src
│   │   └── VideoPlayer.js
│   ├── package.json
│   └── ...
├── dash-server
│   ├── Dockerfile
│   ├── server.js
│   ├── LocalFiles
│   │   ├── videos
│   │   │   ├── chunk-stream*.m4s
│   │   │   ├── init-stream*.m4s
│   │   │   └── manifest.mpd
│   ├── package.json
│   └── ...
├── Goal
│   └── documentation.md
├── Stack grafana & prometheus
│   ├── docker-compose.yml
│   ├── prometheus.yml
│   ├── alertmanager.yml
│   ├── grafana
│   │   ├── provisioning
│   │   │   ├── datasources
│   │   │   └── dashboards
│   └── caddy
│       └── Caddyfile
├── docker-compose.yml
├── prometheus.yml
└── README.md
```

---

## Instructions d'Installation et de Lancement

### Prérequis

Assurez-vous d'avoir les outils suivants installés sur votre machine :

- **Docker** (version 20.10 ou supérieure)
- **Docker Compose** (version 1.29 ou supérieure)
- **FFmpeg** (pour générer les fichiers DASH)

---

### Étapes de Déploiement

1. **Clonez le dépôt** :
   ```bash
   git clone https://github.com/CLOUD-COMPUTING-PROJECT-M1-GI/projet-completgit
   cd votre-repo
   ```

2. **Construisez les images Docker** :
   ```bash
   docker-compose build
   ```

3. **Démarrez les services** :
   ```bash
   docker-compose up -d
   ```

4. **Vérifiez que tous les services sont opérationnels** :
   ```bash
   docker-compose ps
   ```

5. **Accédez aux interfaces web** :
   - **Client React** : [http://localhost:5173](http://localhost:5173)
   - **Grafana** : [http://localhost:3000](http://localhost:3000) (Identifiants par défaut : admin/admin)
   - **Prometheus** : [http://localhost:9090](http://localhost:9090)
   - **Alertmanager** : [http://localhost:9093](http://localhost:9093)

---

### Configuration du Streaming Adaptatif

#### Génération des Fichiers DASH

Pour générer les fichiers vidéo segmentés et le fichier MPD, utilisez FFmpeg avec la commande suivante :

```bash
ffmpeg -i video.mp4 \
  -c:v libx264 -b:v 5000k -maxrate 5000k -bufsize 5000k -vf "scale=1920:1080" -g 48 -keyint_min 48 -sc_threshold 0 -c:a aac -b:a 128k -f dash chunk-stream7_%d.m4s \
  -c:v libx264 -b:v 3000k -maxrate 3000k -bufsize 3000k -vf "scale=1280:720" -g 48 -keyint_min 48 -sc_threshold 0 -c:a aac -b:a 128k -f dash chunk-stream6_%d.m4s \
  -init_seg_name 'init-stream$RepresentationID$.m4s' \
  -media_seg_name 'chunk-stream$RepresentationID$-$Number%.m4s' \
  -适应性流媒体输出 manifest.mpd
```

Placez les fichiers générés dans le répertoire `dash-server/LocalFiles/videos`.

---

### Simulation des Variations de Réseau

Pour simuler des variations de bande passante et de latence, exécutez le script suivant dans le conteneur client :

```bash
docker exec -it dash-client bash
./simulate_network.sh
```

Le script `simulate_network.sh` est situé dans le répertoire `dash-client`.

---

## Fonctionnalités Clés

1. **Serveur DASH** :
   - Basé sur Node.js et Express.
   - Sert les fichiers vidéo segmentés et le fichier MPD.

2. **Client React** :
   - Utilise Dash.js pour lire le flux vidéo adaptatif.
   - Implémente un algorithme personnalisé pour ajuster dynamiquement la qualité du flux.

3. **Surveillance avec Prometheus et Grafana** :
   - Collecte et visualise les métriques système et réseau.
   - Permet de surveiller les performances en temps réel.

4. **Simulation de Conditions Réseau** :
   - Utilise `tc` pour limiter la bande passante et ajouter de la latence.

---

## Contributions

Les contributions sont les bienvenues ! Pour contribuer, suivez ces étapes :

1. Clonez le dépôt.
2. Créez une branche pour vos modifications (`git checkout -b feature/nom-de-votre-feature`).
3. Soumettez vos changements (`git commit -m "Description de votre modification"`).
4. Envoyez une pull request.

---

## Remerciements

Nous remercions l'équipe enseignante du Master 1 Génie Informatique pour leur soutien et leurs précieux conseils tout au long de ce projet. 


Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter ! 😊