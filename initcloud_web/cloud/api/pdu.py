# -*- coding: utf-8 -*-

import logging
import telnetlib
import re

from django.conf import settings

LOG = logging.getLogger(__name__)

FIN = 'input order:'
INPUT_REX = re.compile("[\n\w\d\s]+:([\d\.]+)[^\n\s]*")
OUTPUT_REX = re.compile("[\n\w\d\s]+:([\d\.ON-]+)[^\n\s]*")

def _input_parse(raw):
    r = INPUT_REX.findall(raw)
    return {
        'I': r[0],
        'U': r[1],
        'PF': r[2],
        'P': r[3],
        'E': r[4]
    }

def _output_parse(raw):
    r = OUTPUT_REX.findall(raw)
    return {
        'current': r[0], # A
        'min': r[1], # A
        'max': r[2], # A
        'energy': r[3], # kWh
        'power': r[4], # W
        'switch': r[5],
    }

def _query(host, port, usr, pwd, cmds):
    """
    :params: host = telnet host
    :params: port = telnet port
    :params: usr = telnet username
    :params: pwd = telnet password
    :params: cmds = [{'cmd': str, 'parser': func}, ...]
    """
    ret = []
    # For test
    # print host, port, usr, pwd
    # test_input = 'I1:10.36A               (0.00A ~ 32.00A)\nU1:226.3V               (90.0V ~ 250.0V)\nPF1:0.89        P1:2344W\nE1:1668.0kWh\n'
    # test_output = 'current:2.27A\nmin:0.00A\nmax:16.00A\nenergy:543.3kWh\npower:514W\nswitch:ON\n'
    # for cmd in cmds:
        # if cmd['cmd'] == 'INPUT 0\n':
            # ret.append(cmd['parser'](test_input))
        # else:
            # ret.append(cmd['parser'](test_output))
    # return ret
    try:
        tn = telnetlib.Telnet(host, \
                port=port, \
                timeout=3)

        tn.read_until('login:')
        tn.write(usr+'\n')

        tn.read_until('password:')
        tn.write(pwd+'\n')

        tn.read_until(FIN)
        for cmd in cmds:
            tn.write(cmd['cmd'])
            ret.append(cmd['parser'](tn.read_until(FIN)))

        tn.close()
            
    except Exception, e:
        LOG.error('PDU error: %s' % e)
        print 'PDU error: %s' % e

    return ret

def get_pdu_input():
    """
    :return: [{'I': A, 'U': V, 'PF': , 'P': W, 'E': kWh}, ...]
    """
    ret = []
    for host, port, usr, pwd in \
            zip(settings.PDU_HOST, settings.PDU_PORT, \
            settings.PDU_USERNAME, settings.PDU_PASSWORD):
        input_data = _query(host, port, usr, pwd, \
                [{'cmd': 'INPUT 0\n', 'parser': _input_parse}])
        if len(input_data) > 0:
            ret.append(input_data[0])
    return ret

def get_pdu_output_status(pdu, outlets):
    """
    :params: pdu = 0 or 1
    :params: outlets = [1, 2, 3, ...]
    :return: {1: True, 2: False, 3: True, ...}
    """
    res = _query(settings.PDU_HOST[pdu], \
            settings.PDU_PORT[pdu], \
            settings.PDU_USERNAME[pdu], \
            settings.PDU_PASSWORD[pdu], \
            [{'cmd': 'OUTPUT 0 %d\n' % i, \
            'parser': _output_parse} for i in outlets])
    # print res, len(outlets), len(res)
    ret = {}
    for k, v in zip(outlets, res):
        ret[k] = True if v['switch'] == 'ON' else False

    return ret

