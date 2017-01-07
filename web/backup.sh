#!/bin/bash
owner=daiqinglin
filename=/home/$owner/easygoing/easygoing.$(date +%Y%m%d).gz

mongodump --archive=$filename --gzip --db orders

echo "Nightly Backup Successful: $(date +%F)" >> /home/$owner/easygoing/easygoing.log