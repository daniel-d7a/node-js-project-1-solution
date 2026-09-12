#!/bin/sh

# Reset and seed every hour in the background
while true; do
  sleep 3600
  echo "--- Scheduled reset ---"
  node reset.js
done &

# Start the server
node index.js
