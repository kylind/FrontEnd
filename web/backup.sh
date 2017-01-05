mongodump --archive=/home/kylin/easygoing/orders.2017-1-5.gz --gzip --db orders

echo "Nightly Backup Successful: $(date +%F)" >> /tmp/mybackup.log