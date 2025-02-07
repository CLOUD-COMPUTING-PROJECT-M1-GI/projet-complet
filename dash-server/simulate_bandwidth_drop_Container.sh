#!/bin/bash

# CONFIGURATION
INTERFACE="eth0"              # Interface réseau interne du conteneur
INITIAL_BANDWIDTH="500kbit"   # Bande passante initiale
REDUCE_STEP="100kbit"         # Réduction progressive
DURATION=120                  # Durée totale en secondes (2 minutes)
INTERVAL=30                   # Intervalle de baisse (30 secondes)

# Vérifier si tc est installé
if ! command -v tc &> /dev/null; then
    echo "❌ Erreur : tc (Traffic Control) n'est pas installé dans ce conteneur."
    exit 1
fi

# Fonction pour appliquer une limitation de bande passante
apply_limit() {
    local rate=$1
    echo "🔻 Réduction de la bande passante à $rate..."
    tc qdisc replace dev "$INTERFACE" root tbf rate "$rate" burst 1600 limit 3000
}

# 1️⃣ Initialisation : Appliquer la bande passante initiale
apply_limit "$INITIAL_BANDWIDTH"

# 2️⃣ Réduction progressive
current_bandwidth="$INITIAL_BANDWIDTH"

for (( i=1; i<=DURATION/INTERVAL; i++ )); do
    # Convertir la bande passante actuelle en nombre (ex: "500kbit" -> 500)
    current_value=$(echo "$current_bandwidth" | grep -oE '[0-9]+')
    
    # Calculer la nouvelle bande passante
    new_value=$((current_value - 100)) # On réduit de 100 kbps
    new_bandwidth="${new_value}kbit"

    # Appliquer la nouvelle limite
    apply_limit "$new_bandwidth"

    # Mettre à jour la bande passante courante
    current_bandwidth="$new_bandwidth"

    # Attendre avant la prochaine réduction
    sleep "$INTERVAL"
done

# 3️⃣ Retour à la normale
echo "🔄 Remise à la normale..."
tc qdisc del dev "$INTERFACE" root
echo "✅ Test terminé, bande passante restaurée !"
