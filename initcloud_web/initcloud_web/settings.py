# -*- coding:utf8 -*-
"""
Django settings for initcloud_web project.

Generated by 'django-admin startproject' using Django 1.8.1.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import logging
import logging.config
from django.utils.translation import ugettext_lazy as _

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '@ybbpz49p^1x#0&un2!8i4*!9k#dav&83l7sl-ib%)-$t3jyfj'
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
ALLOWED_HOSTS = ["*",]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'captcha',
    'biz',
    'biz.account',
    'biz.policy_nova',
    'biz.policy_cinder',
    'biz.policy_neutron',
    'biz.alarm',
    'biz.UserGrouper',
    'biz.role',
    'biz.group',
    'biz.idc',
    'biz.instance',
    'biz.image',
    'biz.instancemanage',
    'biz.floating',
    'biz.network',
    'biz.lbaas',
    'biz.volume',
    'biz.workflow',
    'cloud',
    'render',
    'frontend',
    'initcloud_web',
    'biz.firewall',
    'biz.forum',
    'biz.backup',
    'biz.billing',
    'biz.myapp',
    'biz.phy_monitor',
    'biz.storage_monitor',
    'biz.network_monitor',
    'biz.network_bar_router',
    'biz.network_bar_sdn',
    'biz.network_bar_net',
    'biz.network_bar_loadbanlance',
    'biz.cloud_monitor',
    'biz.cloud_monitor_detail',
    'biz.virtualmechine_bar',
    'biz.service_bar',

]

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    #'django.middleware.security.SecurityMiddleware',
)

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication'
    ),  

    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',

    ),  

}

ROOT_URLCONF = 'initcloud_web.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.core.context_processors.media',
                'django.core.context_processors.static',
            ],
        },
    },
]


WSGI_APPLICATION = 'initcloud_web.wsgi.application'


# Database

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Internationalization

LANGUAGE_CODE = 'zh_CN'
LANGUAGES_SUPPORTED = (
    ('en', _('English')),
    ('zh_CN', _('Chinese')),
)
USE_I18N = True
USE_L10N = True
TIME_ZONE = 'Asia/Shanghai'
USE_TZ = False

FORMAT_MODULE_PATH = 'initcloud_web.formats'
DATETIME_FORMAT="Y-m-d H:i"


STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'
LOGIN_URL = '/login'

LOG_PATH = BASE_DIR
LOG_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        "verbose": {
            'format': '%(asctime)s %(levelname)s [Line: %(lineno)s] -- %(message)s',
            "datefmt": "%Y-%m-%d %H:%M:%S"
        }
    },
    'handlers': {
        'default': {
            'level': 'DEBUG',
            'filters': None,
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/initcloud/initcloud.log',
            'formatter': 'verbose'
        },

        'cloud.tasks.handler': {
            'level': 'DEBUG',
            'filters': None,
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/initcloud/celery_task.log',
            'formatter': 'verbose'
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
        'mail_admin': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': False,
        },
    },
    'loggers': {
        'root': {
            'handlers': ['default'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': True,
        },

        'biz': {
            'handlers': ['default', 'mail_admin'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': True,
        },

        'cloud': {
            'handlers': ['cloud.tasks.handler', 'mail_admin'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': True,
        },
        'django.db.backends': {
            'level': 'DEBUG',
            'handers': ['console'],
        },
    }
}

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.core.context_processors.tz',
    'django.contrib.messages.context_processors.messages',
    'initcloud_web.context_processors.initcloud'
)

from local.default_settings import *

try:
    from local.local_settings import *
except (ImportError, ImportWarning) as e:
    print "\033[44;37m ###################################### \033[0m"
    print "\033[44;37m                                        \033[0m"
    print "\033[44;37m                                        \033[0m"
    print "\033[44;37m        No local settings exist         \033[0m"
    print "\033[44;37m      path: local/local_settings.py     \033[0m"
    print "\033[44;37m     if you want to custom settings     \033[0m"
    print "\033[44;37m create local_settings.py and config it.\033[0m"
    print "\033[44;37m                                        \033[0m"
    print "\033[44;37m                                        \033[0m"
    print "\033[44;37m ###################################### \033[0m"

CAPTCHA_IMAGE_BEFORE_FIELD = False

if LDAP_AUTH_ENABLED:
    from local.ldap_settings import *
    AUTHENTICATION_BACKENDS = (
        'django_auth_ldap.backend.LDAPBackend',
        'django.contrib.auth.backends.ModelBackend'
    )

SITE_CONFIG = {
    "QUOTA_CHECK": QUOTA_CHECK,
    "MULTI_ROUTER_ENABLED": MULTI_ROUTER_ENABLED,
    "BRAND": BRAND,
    "ICP_NUMBER": ICP_NUMBER,
    "COPY_RIGHT": COPY_RIGHT,
    "WORKFLOW_ENABLED": WORKFLOW_ENABLED,
    "TRI_ENABLED": TRI_ENABLED,
    "BATCH_INSTANCE_LIMIT": BATCH_INSTANCE,
    "BACKUP_ENABLED": BACKUP_ENABLED,
    "THEME": THEME_NAME
}

logging.config.dictConfig(LOG_CONFIG)


# Added by arthur

ADMIN_TOKEN = "d91d301a60af498b8d31e17c6b2b86d6"
ADMIN_TENANT_ID = "4296a1c5a206402c8917bc9c991cadcc"
ADMIN_NAME = "admin"
EDNPOINT = "http://localhost:35357/v2.0"
ADMIN_TENANT_NAME = "admin"
ADMIN_PASS = "admin"
AUTH_URL = "http://localhost:5000/v2.0/"
NOVA_VERSION = "2"
TENANT_DEFAULT_NETWORK = "10.0.0.0/24"
GATEWAY_IP = "10.0.0.1"
TEST_TENANT_NAME = "testwork"
TEST_TENANT_ID = "cde7d6ed392941c5b75a3079459690d4"
ALARM_ACTIONS = "http://192.168.223.108:5998/wsgi_app.py"
RESULT = [{"meter_name": "cpu_util"},{'meter_name':"memory.usage"},{"meter_name": "disk.write.bytes"},{"meter_name": "network.incoming.bytes"}, {"meter_name": "network.outgoing.bytes"}]

COMPUTE_HOSTS = {'libertyall': "192.168.223.108"}

DEVICEPOLICY = [{"name":"usb"}]
VLAN_ENABLED = False 

# phy_monitor
REDFISH_SIMULATE = True
REDFISH_URL = {
    'phy_server': {
        '1': ["https://172.27.9.2", "https://172.27.9.3", "https://172.27.9.4", "https://172.27.9.5"],
        '2': ["https://172.27.9.12", None, "https://172.27.9.14", "https://172.27.9.15"],
        '3': [],
        '4': [],
        '5': []
    },
    'storage_server': ["https://172.27.9.6", "https://172.27.9.7"]
}
REDFISH_USR = "ADMIN"
REDFISH_PSD = "ADMIN"
# phy_monitor_model
SWITCH_MODEL = {
    "1": "model1", 
    "2": "model2", 
    "3": "model3",
    "4": ""
}
SERVER_MODEL = {
    '1': 'model1',
    '2': 'model2',
    '3': 'model3',
    '4': 'model4',
    '5': 'model5'
}
JBOD_MODEL = {
    '1': 'model1',
    '2': 'model2'
}
STORAGE_MODEL = 'model'

# phy_monitor_switch_address
SWITCH_ADDR = {
    '1': None,
    '2': None,
    '3': None,
    '4': None
}

# storage_monitor
STORAGE_URL = [
    "http://221.239.81.82:17331", "http://221.239.81.82:17332",
    "http://10.0.76.10:9331", "http://10.0.76.20:9331"
]

# warning address
REQ_URL = "http://10.10.21.97:8081"
REQ_USERNAME = "root"
REQ_PASSWD = "123456"
REQ_CONTENT_FMT = '服务器提醒 %s 发送告警。事件是 %s，到达 %s，告警次数 %d'

# warning threshold
PHY_THRES = {
    'phy': {
        '1': {
            'cpu_temp_max': 80,
            'cpu_temp_min': 20,
            'cpu_volt_max': 5,
            'cpu_volt_min': 1,
            'mem_volt_max': 5,
            'mem_volt_min': 1
        },
        '2': {
            'cpu_temp_max': 80,
            'cpu_temp_min': 20,
            'cpu_volt_max': 5,
            'cpu_volt_min': 1,
            'mem_volt_max': 5,
            'mem_volt_min': 1
        },
        '3': {
            'cpu_temp_max': 80,
            'cpu_temp_min': 20,
            'cpu_volt_max': 5,
            'cpu_volt_min': 1,
            'mem_volt_max': 5,
            'mem_volt_min': 1
        },
        '4': {
            'cpu_temp_max': 80,
            'cpu_temp_min': 20,
            'cpu_volt_max': 5,
            'cpu_volt_min': 1,
            'mem_volt_max': 5,
            'mem_volt_min': 1
        },
        '5': {
            'cpu_temp_max': 80,
            'cpu_temp_min': 20,
            'cpu_volt_max': 5,
            'cpu_volt_min': 1,
            'mem_volt_max': 5,
            'mem_volt_min': 1
        }
    },
    'store': [
        {
            'cpu_temp_max': 80, # degree cetigrade
            'cpu_temp_min': 20,
            'cpu_volt_max': 5, # volt
            'cpu_volt_min': 1,
            'mem_volt_max': 5,
            'mem_volt_min': 1
        },
        {
            'cpu_temp_max': 80,
            'cpu_temp_min': 20,
            'cpu_volt_max': 5,
            'cpu_volt_min': 1,
            'mem_volt_max': 5,
            'mem_volt_min': 1
        }
    ]
}

STORAGE_THRES = {
    'read_min': 500, # MB/s
    'read_max': 5000,
    'write_min': 500,
    'write_max': 5000
}

STORAGE_THRES_SSB = [
    { # node1
        'cpu_util_min': 50, # %
        'cpu_util_max': 50,
        'mem_util_min': 50,
        'mem_util_max': 50,
        'read_min': 500,
        'read_max': 5000,
        'write_min': 500,
        'write_max': 5000
    },
    { # node2
        'cpu_util_min': 50,
        'cpu_util_max': 50,
        'mem_util_min': 50,
        'mem_util_max': 50,
        'read_min': 500,
        'read_max': 5000,
        'write_min': 500,
        'write_max': 5000
    }
]

CPU_FREQUENCY = '3.4kHz'
CPU_TYPE = 'E36608'
CLOUD_MONITOR_FAKE = True
