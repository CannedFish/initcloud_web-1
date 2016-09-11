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
        rsp['code'] = r.status_code
    except Exception, e:
        rsp['code'] = 500
        LOG.info(e)
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
        rsp['code'] = r.status_code
    except Exception, e:
        rsp['code'] = 500
        LOG.info(e)
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
        rsp['code'] = r.status_code
    except Exception, e:
        rsp['code'] = 500
        LOG.info(e)
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
        rsp['code'] = r.status_code
    except Exception, e:
        rsp['code'] = 500
        LOG.info(e)
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
        rsp['code'] = r.status_code
    except Exception, e:
        rsp['code'] = 500
        LOG.info(e)
    return rsp

def __delete(url):
    """
    The DELETE method is used to remove a resource.
    """
    rsp = {}
    try:
        my_headers = {"content-type": "application/json"}
        r = requests.delete(url, auth=__AUTH, headers=my_headers, verify=False)
        rsp['code'] = r.status_code
    except Exception, e:
        rsp['code'] = 500
        LOG.info(e)
    return rsp

def query(r_url, dst):
    url = r_url + dst
    return __read_requests(url)

# Chassis
def get_chassis_list(r_url):
    url = r_url + '/redfish/v1/Chassis'
    return __read_requests(url)

def get_chassis(r_url, no):
    url = r_url + '/redfish/v1/Chassis/%d' % no
    return __read_requests(url)

def get_chassis_thermal(r_url, chassis_path):
    url = r_url + '%s/Thermal' % chassis_path
    return __read_requests(url)

def get_chassis_power(r_url, chassis_path):
    url = r_url + '%s/Power' % chassis_path
    return __read_requests(url)

# Systems
def get_systems_list(r_url):
    url = r_url + '/redfish/v1/Systems'
    return __read_requests(url)

def get_systems(r_url, no):
    url = r_url + '/redfish/v1/Systems/%d' % no
    return __read_requests(url)

def get_systems_processors(r_url, sys_no, pro_no):
    url = r_url + '/redfish/v1/Systems/%d/Processors/%d' % (sys_no, pro_no)
    return __read_requests(url)

def get_systems_simplestorage(r_url, no):
    url = r_url + '/redfish/v1/Systems/%d/SimpleStorage' % no
    return __read_requests(url)

def get_systems_ethernetinterfaces(r_url, sys_no, eth_no):
    url = r_url + '/redfish/v1/Systems/%d/EthernetInterfaces/%d' % (sys_no, eth_no)
    return __read_requests(url)

# SessionService
def create_session(r_url):
    """
    OK to return 201
    token and session ID
    """
    url = r_url + '/redfish/v1/SeesionService/Sessions/'
    data = {
        "UserName": settings.REDFISH_USR,
        "Password": settings.REDFISH_PSD
    }
    return __create(url, json.dumps(data))

def delete_session(r_url, s_id):
    """
    OK to return 200
    """
    url = r_url + '/redfish/v1/SeesionService/Sessions/%d' % s_id
    return __delete(url)

def config_session(r_url, data):
    """
    OK to return 200
    ::data:: json object
    """
    url = r_url + '/redfish/v1/SessionService/'
    return __update(url, json.dumps(data))

# EventService
def get_eventservices(r_url):
    url = r_url + '/redfish/v1/EventService/'
    return __read_requests(r_url, url)

def subscribe_event(r_url, data):
    """
    ::data:: event description object
    """
    url = r_url + '/redfish/v1/EventService/Subscriptions/'
    return __create(url, json.dumps(data))

def get_subscriptions(r_url):
    url = r_url + '/redfish/v1/EventService/Subscriptions/'
    return __read_requests(url)

def delete_subscription(r_url, e_id):
    url = r_url + '/redfish/v1/EventService/Subscriptions/%d' % e_id
    return __delete(url)

def send_test_event(r_url, data):
    """
    ::data:: like {"EventType":"Alert"}
    """
    url = r_url + '/redfish/v1/EventService/Actions/EventService.SendTestEvent'
    return __actions(url, json.dumps(data))

