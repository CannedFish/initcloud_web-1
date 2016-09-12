# !/bin/sh
cd /var/www/initcloud_web/initcloud_web

su initcloud

/var/www/initcloud_web/.venv/bin/python -m celery worker --time-limit=600 --concurrency=8 -n initcloud@libertyall --app=cloud --loglevel=DEBUG --logfile=/var/log/celery/initcloud.log --pidfile=/var/run/celery/initcloud.pid
