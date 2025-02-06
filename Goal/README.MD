Il s'agit en réalité de créer une **solution résiliente** capable de s'adapter aux variations de la bande passante, en utilisant des **conteneurs Docker**, **SDN (Software Defined Networking)** et **eBPF** pour la gestion et l'observation du trafic réseau.  

## 📌 **Décryptage du sujet**  
Voici une version simplifiée et plus claire de ce que tu dois faire :  

1. **Créer une plateforme de streaming vidéo conteneurisée**  
   - Un serveur de streaming vidéo dans un conteneur Docker (Node.js avec un serveur DASH, ou autre techno adaptée).  
   - Un client vidéo dans un autre conteneur (React avec un player DASH ou simplement VLC).  
   - Relier les conteneurs via **Containernet** (un outil pour simuler un réseau SDN avec Docker).  

2. **Simuler des pertes de bande passante**  
   - Utiliser **tc (Traffic Control)** pour introduire de la latence, du jitter ou des pertes de paquets.  
   - Observer comment cela impacte la qualité du streaming.  

3. **Adapter dynamiquement la qualité du streaming**  
   - Le lecteur vidéo doit pouvoir modifier **automatiquement** la résolution en fonction de la bande passante disponible (comme YouTube).  
   - **eBPF** sera utilisé pour récupérer et analyser le trafic en temps réel.  
   - L'idée est d'intégrer un contrôleur SDN pour ajuster le routage des flux vidéo en fonction des conditions réseau.  

4. **Mettre en place un monitoring avancé**  
   - **Prometheus** collectera les métriques réseau (latence, perte de paquets, etc.).  
   - **Grafana** affichera ces données sous forme de graphiques.  

5. **Ajouter un mécanisme de filtrage avec eBPF**  
   - Récupérer et afficher les tailles des paquets échangés.  
   - Bloquer certains types de trafic (ex : refuser les paquets de plus de 400MB et ceux qui ne sont pas en HTTPS).  


## 🎯 **Comment t’y prendre ?**  

### 1️⃣ **Mise en place de l’architecture Docker avec Containernet**  
Tu dois créer un **fichier Docker Compose** qui contiendra :  
- Un conteneur pour le **serveur vidéo** (Node.js, Express avec un serveur DASH).  
- Un conteneur pour le **client** (React avec video.js, ou un simple lecteur DASH).  
- Un **réseau Docker** géré avec **Containernet** pour simuler un vrai environnement réseau.  

### 2️⃣ **Ajout de la simulation de perte de bande passante**  
- Installer **tc (Traffic Control)** sur le système hôte et dans les conteneurs.  
- Appliquer des **règles de latence et de perte** pour tester différentes conditions.  

### 3️⃣ **Détection et adaptation dynamique de la qualité vidéo**  
- Utiliser **eBPF** pour récupérer des infos sur le réseau en temps réel.  
- Modifier dynamiquement le **bitrate du flux vidéo** en fonction des conditions détectées.  

### 4️⃣ **Mise en place du monitoring avec Prometheus et Grafana**  
- Configurer Prometheus pour récupérer des métriques réseau.  
- Intégrer Grafana pour visualiser les performances en direct.  

### 5️⃣ **Ajout du filtrage réseau avec eBPF**  
- Développer un programme eBPF pour **bloquer les paquets non HTTPS**.  
- Refuser les **paquets de plus de 400MB**.  


## 📌 **Par quoi commencer ?**  
1️⃣ **Mettre en place l’infrastructure Docker avec Containernet.**  
2️⃣ **Déployer un serveur vidéo DASH simple (ex: avec Node.js et Express).**  
3️⃣ **Créer un client React (ou utiliser VLC) qui peut lire le flux vidéo.**  
4️⃣ **Tester la connexion entre les deux conteneurs.**  
5️⃣ **Ajouter la simulation de perte de bande passante avec `tc`.**  
6️⃣ **Mettre en place eBPF pour récupérer les infos réseau et filtrer le trafic.**  
7️⃣ **Ajouter Prometheus + Grafana pour voir l’impact en temps réel.**  


