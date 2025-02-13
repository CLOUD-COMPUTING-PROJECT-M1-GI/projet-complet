# Stack de Monitoring Docker

Une solution complète de monitoring pour vos hôtes Docker et conteneurs basée sur [Prometheus](https://prometheus.io/), [Grafana](http://grafana.org/), [cAdvisor](https://github.com/google/cadvisor), [NodeExporter](https://github.com/prometheus/node_exporter) et [AlertManager](https://github.com/prometheus/alertmanager) pour les alertes.

## 🚀 Installation

Clonez ce dépôt sur votre machine hôte Docker, accédez au répertoire et lancez docker-compose :

```bash
git clone https://github.com/CLOUD-COMPUTING-PROJECT-M1-GI/projet-complet.git
cd "projet-complet/Stack grafana & prometheus"

ADMIN_USER='admin' ADMIN_PASSWORD='admin' ADMIN_PASSWORD_HASH='$2a$14$1l.IozJx7xQRVmlkEQ32OeEEfP5mRxTpbDTCTcXRqn19gXD8YK1pO' docker-compose up -d
```

**Note importante**: Caddy v2 n'accepte plus les mots de passe en clair. Vous devez fournir une version hashée du mot de passe. Le hash ci-dessus correspond au mot de passe 'admin'.

### Prérequis
* Docker Engine ≥ 1.13
* Docker Compose ≥ 1.11

## 🔧 Configuration de Caddy v2

Pour générer un nouveau hash de mot de passe, exécutez :
```bash
docker run --rm caddy caddy hash-password --plaintext 'VOTRE_MOT_DE_PASSE'
```

## 🛠 Composants de la Stack

* Prometheus (base de données de métriques) - `http://<ip-hôte>:9090`
* Prometheus-Pushgateway (accepteur pour les jobs éphémères) - `http://<ip-hôte>:9091`
* AlertManager (gestion des alertes) - `http://<ip-hôte>:9093`
* Grafana (visualisation des métriques) - `http://<ip-hôte>:3000`
* NodeExporter (collecteur de métriques hôte)
* cAdvisor (collecteur de métriques des conteneurs)
* Caddy (proxy inverse et authentification)

## 📊 Configuration de Grafana

1. Accédez à `http://<ip-hôte>:3000`
2. Connectez-vous avec:
   * Utilisateur: **admin**
   * Mot de passe: **admin**

### Modification des Identifiants

Vous pouvez modifier les identifiants de deux façons :

1. Via le fichier docker-compose:
```yaml
grafana:
  image: grafana/grafana:7.2.0
  env_file:
    - config
```

2. Via un fichier de configuration:
```yaml
GF_SECURITY_ADMIN_USER=admin
GF_SECURITY_ADMIN_PASSWORD=nouveaumotdepasse
GF_USERS_ALLOW_SIGN_UP=false
```

### 📈 Tableaux de Bord Préconfigurés

#### Dashboard Hôte Docker
![Dashboard Hôte](https://raw.githubusercontent.com/stefanprodan/dockprom/master/screens/Grafana_Docker_Host.png)

Ce dashboard affiche :
* Uptime serveur, utilisation CPU, mémoire disponible
* Charge système
* Utilisation CPU par mode
* Distribution de la mémoire
* Utilisation I/O
* Utilisation réseau
* Utilisation du swap

#### Dashboard Conteneurs Docker
![Dashboard Conteneurs](https://raw.githubusercontent.com/stefanprodan/dockprom/master/screens/Grafana_Docker_Containers.png)

Visualisez :
* Charge CPU totale des conteneurs
* Utilisation mémoire et stockage
* Statistiques réseau par conteneur
* Métriques de performance individuelles

#### Dashboard Services de Monitoring
![Services Monitoring](https://raw.githubusercontent.com/stefanprodan/dockprom/master/screens/Grafana_Prometheus.png)

## ⚠️ Configuration des Alertes

Trois groupes d'alertes sont préconfigurés :
* Alertes services de monitoring
* Alertes hôte Docker
* Alertes conteneurs Docker

### Exemples d'Alertes

```yaml
# Alerte si un service est down
- alert: service_down
    expr: up == 0
    for: 30s
    labels:
      severity: critical
    annotations:
      description: "Le service {{ $labels.instance }} est down."

# Alerte charge CPU élevée
- alert: cpu_charge_elevee
    expr: node_load1 > 1.5
    for: 30s
    labels:
      severity: warning
    annotations:
      description: "Charge CPU à {{ $value}}%"
```

## 📱 Configuration des Notifications

AlertManager peut envoyer des notifications via :
* Email
* Slack
* Teams
* Discord
* Webhook personnalisé

### Configuration Slack
1. Créez un webhook Slack
2. Configurez dans `alertmanager/config.yml`:

```yaml
receivers:
    - name: 'slack'
      slack_configs:
          - channel: '#monitoring'
            api_url: 'https://hooks.slack.com/services/VOTRE_WEBHOOK'
```

![Notifications Slack](https://raw.githubusercontent.com/stefanprodan/dockprom/master/screens/Slack_Notifications.png)

## 🔄 Mise à Jour de Grafana

Pour les versions ≥ 5.1, l'ID utilisateur a changé de 104 à 472. Pour gérer cette migration, référez-vous à la documentation officielle de Grafana.

## 👥 Contributeurs
Ce projet est basé sur le travail des étudiants de M1-GI. Vous pouvez trouver le projet complet ici : [Projet Cloud Computing M1-GI](https://github.com/CLOUD-COMPUTING-PROJECT-M1-GI/projet-complet/tree/main/Stack%20grafana%20%26%20prometheus)