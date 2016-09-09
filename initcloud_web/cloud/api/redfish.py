# -*- coding: utf-8 -*-
import logging, requests, json
from requests.auth import HTTPBasicAuth

from django.conf import settings

LOG = logging.getLogger(__name__)
__AUTH = HTTPBasicAuth(settings.REDFISH_USR, settings.REDFISH_PSD)

# verbs
def __read_requests(url):
    """
    The GET method is used to request a representation of a specified resource.
    The representation can be either a single resource or a collection.
    """
    rsp = {}
    try:
        my_headers = {"content-type": "application/json"}
        r = requests.get(url, headers=my_headers, auth=__AUTH, verify=False)
        rsp['body'] = r.json()
    except Exception, e:
        LOG.info(e)
    rsp['code'] = r.status_code
    return rsp

def __update(url, data):
    """
    The PATCH method is used to apply partial modifications to a resource.
    """
    rsp = {}
    try:
        my_headers = {"content-type": "application/json"}
        r = requests.patch(url, data=data, headers=my_headers, auth=__AUTH, verify=False)
        rsp['body'] = r.json()
    except Exception, e:
        LOG.info(e)
    rsp['code'] = r.status_code
    return rsp

def __replace(url, data):
    """
    The PUT method is used to completely replace a resource. 
    Any properties omitted from the body of the
    request are reset to their default value.
    """
    rsp = {}
    try:
        my_headers = {"content-type": "application/json"}
        r = requests.put(url, data=data, headers=my_headers, auth=__AUTH, verify=False)
        rsp['body'] = r.json()
    except Exception, e:
        LOG.info(e)
    rsp['code'] = r.status_code
    return rsp


def __create(url, data):
    """
    The POST method is used to create a new resource.
    This request is submitted to the resource collection
    in which the new resource is meant to belong.
    ::url:: string
    ::data:: json string
    """
    rsp = {}
    try:
        my_headers = {"content-type": "application/json"}
        r = requests.post(url, data=data, headers=my_headers, auth=__AUTH, verify=False)
        rsp['body'] = r.json()
        rsp['header'] = r.headers
    except Exception, e:
        LOG.info(e)
    rsp['code'] = r.status_code
    return rsp

def __actions(url, data):
    """
    The POST method may also be used to initiate operations on the object (Actions). 
    The POST operation may not be idempotent.
    """
    rsp = {}
    try:
        r = requests.post(url, data=data, headers=my_headers, auth=__AUTH, verify=False)
        rsp['body'] = r.json()
    except Exception, e:
        LOG.info(e)
    rsp['code'] = r.status_code
    return rsp

def __delete(url):
    """
    The DELETE method is used to remove a resource.
    """
    rsp = {}
    try:
        my_headers = {"content-type": "application/json"}
        r = requests.delete(url, auth=__AUTH, headers=my_headers, verify=False)
    except Exception, e:
        LOG.info(e)
    rsp['code'] = r.status_code
    return rsp

def query(dst):
    url = settings.REDFISH_URL + dst
    return __read_requests(url)

# Chassis
def get_chassis_list():
    url = settings.REDFISH_URL + '/redfish/v1/Chassis'
    return __read_requests(url)

def get_chassis(no):
    url = settings.REDFISH_URL + '/redfish/v1/Chassis/%d' % no
    return __read_requests(url)

def get_chassis_thermal(no):
    url = settings.REDFISH_URL + '/redfish/v1/Chassis/%d/Thermal' % no
    return __read_requests(url)

def get_chassis_power(no):
    url = settings.REDFISH_URL + '/redfish/v1/Chassis/%d/Power' % no
    return __read_requests(url)

# Systems
def get_systems_list():
    url = settings.REDFISH_URL + '/redfish/v1/Systems'
    return __read_requests(url)

def get_systems(no):
    url = settings.REDFISH_URL + '/redfish/v1/Systems/%d' % no
    return __read_requests(url)

def get_systems_processors(sys_no, pro_no):
    url = settings.REDFISH_URL + '/redfish/v1/Systems/%d/Processors/%d' % (sys_no, pro_no)
    return __read_requests(url)

def get_systems_simplestorage(no):
    url = settings.REDFISH_URL + '/redfish/v1/Systems/%d/SimpleStorage' % no
    return __read_requests(url)

def get_systems_ethernetinterfaces(sys_no, eth_no):
    url = settings.REDFISH_URL + '/redfish/v1/Systems/%d/EthernetInterfaces/%d' % (sys_no, eth_no)
    return __read_requests(url)

# SessionService
def create_session():
    """
    OK to return 201
    token and session ID
    """
    url = settings.REDFISH_URL + '/redfish/v1/SeesionService/Sessions/'
    data = {
        "UserName": settings.REDFISH_USR,
        "Password": settings.REDFISH_PSD
    }
    return __create(url, json.dumps(data))

def delete_session(s_id):
    """
    OK to return 200
    """
    url = settings.REDFISH_URL + '/redfish/v1/SeesionService/Sessions/%d' % s_id
    return __delete(url)

def config_session(data):
    """
    OK to return 200
    ::data:: json object
    """
    url = settings.REDFISH_URL + '/redfish/v1/SessionService/'
    return __update(url, json.dumps(data))

# EventService
def get_eventservices():
    url = settings.REDFISH_URL + '/redfish/v1/EventService/'
    return __read_requests(url)

def subscribe_event(data):
    """
    ::data:: event description object
    """
    url = settings.REDFISH_URL + '/redfish/v1/EventService/Subscriptions/'
    return __create(url, json.dumps(data))

def get_subscriptions():
    url = settings.REDFISH_URL + '/redfish/v1/EventService/Subscriptions/'
    return __read_requests(url)

def delete_subscription(e_id):
    url = settings.REDFISH_URL + '/redfish/v1/EventService/Subscriptions/%d' % e_id
    return __delete(url)

def send_test_event(data):
    """
    ::data:: like {"EventType":"Alert"}
    """
    url = settings.REDFISH_URL + '/redfish/v1/EventService/Actions/EventService.SendTestEvent'
    return __actions(url, json.dumps(data))

