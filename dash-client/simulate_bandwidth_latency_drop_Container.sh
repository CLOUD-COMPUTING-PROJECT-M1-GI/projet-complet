#!/bin/bash

# CONFIGURATION
INTERFACE="eth0"              # Interface réseau interne du conteneur
INITIAL_BANDWIDTH="1mbit"     # Bande passante initiale
MIN_BANDWIDTH="100kbit"       # Bande passante minimale atteignable
REDUCE_STEP="100kbit"         # Réduction progressive (plus fluide)
INITIAL_LATENCY="10ms"        # Latence initiale
LATENCY_STEP="10ms"           # Augmentation progressive de latence
MAX_LATENCY="200ms"           # Latence maximale atteignable
DURATION=150                  # Durée totale en secondes (~2min30s)
INTERVAL=15                   # Intervalle de modification (15s pour plus de fluidité)

# Vérifier si tc est installé
if ! command -v tc &> /dev/null; then
    echo "❌ Erreur : tc (Traffic Control) n'est pas installé dans ce conteneur."
    exit 1
fi

# Fonction pour appliquer une limitation de bande passante
apply_bandwidth_limit() {
    local rate=$1
    echo "🔻 Réduction de la bande passante à $rate..."
    tc qdisc replace dev "$INTERFACE" root tbf rate "$rate" burst 1600 limit 3000
}

# Fonction pour ajouter un délai de latence
apply_latency() {
    local delay=$1
    echo "⏳ Ajout d'une latence de $delay..."
    tc qdisc replace dev "$INTERFACE" root netem delay "$delay"
}

# 1️⃣ Initialisation : Appliquer la bande passante initiale
apply_bandwidth_limit "$INITIAL_BANDWIDTH"

# Variables courantes
current_bandwidth="$INITIAL_BANDWIDTH"
current_latency="$INITIAL_LATENCY"

# 2️⃣ Réduction progressive (alternance bande passante / latence)
for (( i=1; i<=DURATION/INTERVAL; i++ )); do
    if (( i % 2 == 1 )); then
        # Étape 1 : Réduire la bande passante
        current_value=$(echo "$current_bandwidth" | grep -oE '[0-9]+')
        new_value=$((current_value - 100)) # Réduction de 100 kbps
        [[ $new_value -lt 100 ]] && new_value=100  # Empêcher de descendre trop bas
        new_bandwidth="${new_value}kbit"
        apply_bandwidth_limit "$new_bandwidth"
        current_bandwidth="$new_bandwidth"
    else
        # Étape 2 : Augmenter la latence
        current_value=$(echo "$current_latency" | grep -oE '[0-9]+')
        new_value=$((current_value + 10)) # Augmentation de 10ms
        [[ $new_value -gt 200 ]] && new_value=200  # Empêcher de dépasser 200ms
        new_latency="${new_value}ms"
        apply_latency "$new_latency"
        current_latency="$new_latency"
    fi

    # Attendre avant la prochaine modification
    sleep "$INTERVAL"
done

# 3️⃣ Retour progressif à la normale
echo "🔄 Remise à la normale..."
tc qdisc del dev "$INTERFACE" root
echo "✅ Test terminé, bande passante et latence restaurées !"
