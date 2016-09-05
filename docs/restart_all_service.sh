# !/bin/sh

echo "----------------- restart httpd.service ------------------------"
systemctl restart httpd.service



echo "---------------- stop celery ---------------------------"

cd /var/www/initcloud_web/initcloud_web/
../.venv/bin/celery multi stop initcloud_worker --pidfile=/var/log/initcloud/celery_%n.pid


/etc/init.d/celeryd stop
/etc/init.d/celerybeat stop
ps -ef | grep celery



echo "------------------ start celery -------------------"
su - initcloud -c "cd /var/www/initcloud_web/initcloud_web/;../.venv/bin/celery multi restart initcloud_worker -A cloud --pidfile=/var/log/initcloud/celery_%n.pid --logfile=/var/log/initcloud/celery_%n.log &"


/etc/init.d/celeryd restart
/etc/init.d/celerybeat restart

ps  -elf | grep celery
/etc/init.d/celeryd status
/etc/init.d/celerybeat status


