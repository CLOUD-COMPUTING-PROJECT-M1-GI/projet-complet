# README - Serveur DASH

## Description

Ce répertoire contient le code source et les configurations nécessaires pour mettre en œuvre le **serveur DASH** du projet de streaming adaptatif. Le serveur est basé sur **Node.js** et **Express**, et il sert les fichiers vidéo segmentés ainsi que le fichier MPD (Media Presentation Description) aux clients.

Le serveur est également capable de simuler des variations de bande passante et de latence à l'aide de scripts shell qui utilisent l'outil `tc` (Traffic Control). Ces simulations permettent de tester la robustesse de notre algorithme d'adaptation personnalisé.

---

## Structure du Répertoire

Voici l'arborescence du répertoire :

```
dash-server/
├── LocalFiles/
│   └── videos/
│       ├── chunk-stream*.m4s
│       ├── init-stream*.m4s
│       └── manifest.mpd
├── node_modules/
├── .gitignore
├── Dockerfile
├── package-lock.json
├── package.json
├── README.MD
├── server.js
├── simulate_bandwidth_drop_Container.sh
├── simulate_bandwidth_drop_VM.sh
└── simulate_bandwidth_latency_drop_Container.sh
```

### Description des Fichiers et Répertoires

- **LocalFiles/** : Contient les fichiers vidéo segmentés (`chunk-stream*.m4s`, `init-stream*.m4s`) et le fichier MPD (`manifest.mpd`) générés avec FFmpeg.
- **node_modules/** : Répertoire contenant les dépendances Node.js installées automatiquement via `npm install`.
- **.gitignore** : Fichier spécifiant les fichiers ou répertoires à ignorer par Git.
- **Dockerfile** : Configuration pour construire l'image Docker du serveur.
- **package-lock.json** & **package.json** : Fichiers de configuration pour les dépendances Node.js.
- **server.js** : Code principal du serveur DASH, basé sur Express.
- **simulate_bandwidth_drop_Container.sh** : Script pour simuler une réduction progressive de la bande passante dans le conteneur.
- **simulate_bandwidth_drop_VM.sh** : Script pour simuler une réduction de la bande passante directement sur la machine hôte.
- **simulate_bandwidth_latency_drop_Container.sh** : Script combinant la simulation de réduction de bande passante et d'augmentation de latence dans le conteneur.

---

## Instructions d'Installation et de Lancement

### Prérequis

Assurez-vous d'avoir les outils suivants installés :

- **Docker** (version 20.10 ou supérieure)
- **FFmpeg** (pour générer les fichiers DASH)

---

### Étapes de Déploiement

1. **Clonez le dépôt** :
   ```bash
   cd votre-repo/dash-server
   ```

2. **Construisez l'image Docker** :
   ```bash
   docker build -t dash-server .
   ```

3. **Démarrez le conteneur** :
   ```bash
   docker run -d --name dash-server -p 3000:3000 dash-server
   ```

4. **Vérifiez que le serveur est opérationnel** :
   Accédez à [http://localhost:3000](http://localhost:3000) dans votre navigateur. Vous devriez voir une page HTML avec un lecteur vidéo préconfiguré pour lire le flux DASH.

---

### Génération des Fichiers DASH

Pour générer les fichiers vidéo segmentés et le fichier MPD, utilisez FFmpeg avec la commande suivante :

```bash
ffmpeg -i video.mp4 \
  -c:v libx264 -b:v 5000k -maxrate 5000k -bufsize 5000k -vf "scale=1920:1080" -g 48 -keyint_min 48 -sc_threshold 0 -c:a aac -b:a 128k -f dash chunk-stream7_%d.m4s \
  -c:v libx264 -b:v 3000k -maxrate 3000k -bufsize 3000k -vf "scale=1280:720" -g 48 -keyint_min 48 -sc_threshold 0 -c:a aac -b:a 128k -f dash chunk-stream6_%d.m4s \
  -init_seg_name 'init-stream$RepresentationID$.m4s' \
  -media_seg_name 'chunk-stream$RepresentationID$-$Number%.m4s' \
  -适应性流媒体输出 manifest.mpd
```

Placez les fichiers générés dans le répertoire `LocalFiles/videos`.

---

### Simulation des Variations de Réseau

#### 1. Simuler une Réduction de Bande Passante dans le Conteneur

Exécutez le script `simulate_bandwidth_drop_Container.sh` depuis le terminal :

```bash
docker exec -it dash-server bash
./simulate_bandwidth_drop_Container.sh
```

#### 2. Simuler une Réduction de Bande Passante sur la Machine Hôte

Exécutez le script `simulate_bandwidth_drop_VM.sh` directement sur la machine hôte :

```bash
./simulate_bandwidth_drop_VM.sh
```

#### 3. Simuler une Réduction de Bande Passante et une Augmentation de Latence dans le Conteneur

Exécutez le script `simulate_bandwidth_latency_drop_Container.sh` depuis le terminal :

```bash
docker exec -it dash-server bash
./simulate_bandwidth_latency_drop_Container.sh
```

---

## Fonctionnalités Clés

1. **Service de Fichiers Statiques** :
   - Le serveur expose les fichiers vidéo segmentés et le fichier MPD via HTTP.

2. **Route Principale** :
   - Une route `/` est définie pour fournir une page HTML simple contenant un lecteur vidéo configuré pour lire le flux DASH.

3. **Support CORS** :
   - Le serveur inclut une configuration CORS pour autoriser les requêtes provenant du client React.

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