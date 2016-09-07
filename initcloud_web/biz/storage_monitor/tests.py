# -*- coding: utf-8 -*-

from django.contrib.auth.models import AnonymousUser, User
from django.test import TestCase, RequestFactory

from .views import StorageNodeList, TreeNodeList, StorageBarDetail, PhyNodesList
import json

class SimpleTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(username='test', \
                email='test@test.com', password='123456')

    def test_storage_node_list(self):
        req = self.factory.get('/api/storage_monitor/')
        req.user = self.user
        res = StorageNodeList.as_view()(req)
        self.assertEqual(res.status_code, 200)
        res.render()
        print '\n', res.content

    def test_tree_node_list(self):
        req = self.factory.get('/api/treenode/')
        req.user = self.user
        res = TreeNodeList.as_view()(req)
        self.assertEqual(res.status_code, 200)
        res.render()
        print '\n', res.content

    def test_storage_bar(self):
        req = self.factory.get('/api/storage__bar/')
        req.user = self.user
        res = StorageBarDetail.as_view()(req)
        self.assertEqual(res.status_code, 200)
        res.render()
        print '\n', res.content

    def test_phy_nodes(self):
        req = self.factory.get('/api/phy_nodes/')
        req.user = self.user
        res = PhyNodesList.as_view()(req)
        self.assertEqual(res.status_code, 200)
        res.render()
        print '\n', res.content
