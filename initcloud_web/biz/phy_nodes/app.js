/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //phy_nodes
          .state("phy_nodes", {
                url: "/phy_nodes/",
                templateUrl: "/static/management/views/phy_nodes.html",
                data: {pageTitle: 'Phy_Nodes'},
                controller: "Phy_NodesController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/phy_nodes_ctrl.js'
                            ]
                        });
                    }]
                }
            })
