#!/bin/bash
owner=daiqinglin
filename=/home/$owner/sh/dbbatch.js

node $filename

echo "Nightly client and product synchronization Successful: $(date +%F)" >> /home/$owner/easygoing/easygoing.log