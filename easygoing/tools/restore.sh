#!/bin/bash
owner=daiqinglin
filename=/home/$owner/easygoing/easygoing.$(date +%Y%m%d).gz

mongorestore --gzip --archive=$filename --db orders
