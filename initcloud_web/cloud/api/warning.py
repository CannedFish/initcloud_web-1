# -*- coding: utf-8 -*-

import logging
import requests

from django.conf import settings

LOG = logging.getLogger(__name__)

__client = requests.session()

def __get_clinet():
    URL = settings.REQ_URL + '/login'

    re = __client.get(URL, verify=False)
    # TODO: verify session is working or login again
    
    csrftoken = __client.cookies['csrftoken']
    login_data = dict(username=settings.REQ_USERNAME, \
            password=settings.REQ_PASSWD, \
            csrfmiddlewaretoken=csrftoken, \
            next='/')
    login_return = __client.post(URL, data=login_data, \
            headers=dict(Referer=URL))

    return __client

def warn(name, meter, content, count):
    client = __get_clinet()
    payload = {
        "alarm_object": name,
        "alarm_meter": meter,
        "alarm_data": content,
        "alarm_count": count
    }
    LOG.info('=======Warning payload========: \n%s' % payload)
    URL_ = settings.REQ_URL + '/api/alarm/save/'
    instances_return = client.get(URL_, params=payload)

