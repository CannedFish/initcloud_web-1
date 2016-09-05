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

ADMIN_TOKEN = "f14e712d84e243ca8a02dbc799e3184b"
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