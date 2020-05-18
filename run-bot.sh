#!/bin/bash

while true; do
    docker exec nike node bot.js &
    echo "Une exécution";
    sleep 1
done

echo "Tous les scripts ont été exécutés";