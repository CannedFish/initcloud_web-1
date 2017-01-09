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

def _query(cmds):
    """
    :params: cmds = [{'cmd': str, 'parser': func}, ...]
    """
    ret = []
    try:
        tn = telnetlib.Telnet(settings.PDU_HOST, \
                port=settings.PDU_PORT, \
                timeout=3)

        tn.read_until('login:')
        tn.write(settings.PDU_USERNAME+'\n')

        tn.read_until('password:')
        tn.write(settings.PDU_PASSWORD+'\n')

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
    return _query([{'cmd': 'INPUT %d\n' % i, 'parser': _input_parse} for i in (0, 1)])

def get_pdu_output_status(pdu, outlets):
    """
    :params: pdu = 0 or 1
    :params: outlets = [1, 2, 3, ...]
    :return: {1: True, 2: False, 3: True, ...}
    """
    res = _query([{'cmd': 'OUTPUT %d %d\n' % (pdu, i), \
            'parser': _output_parse} for i in outlets])
    # print res, len(outlets), len(res)
    ret = {}
    for k, v in zip(outlets, res):
        ret[k] = True if v['switch'] == 'ON' else False

    return ret

