# -*- coding: utf-8 -*-

import logging
import telnetlib
import re

from django.conf import settings

LOG = logging.getLogger(__name__)

FIN = 'input order:'
INPUT_REX = re.compile("[\n\w\d\s]+:([\d\.]+)[^\n\s]*")

def _input_parse(raw):
    return INPUT_REX.findall(raw)

def _output_parse(raw):
    pass

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
            r = cmd['parser'](tn.read_until(FIN))
            ret.append({
                'I': r[0],
                'U': r[1],
                'PF': r[2],
                'P': r[3],
                'E': r[4]
            })

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

