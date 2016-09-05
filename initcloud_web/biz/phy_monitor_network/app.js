/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //phy_monitor_network
          .state("phy_monitor_network", {
                url: "/phy_monitor_network/",
                templateUrl: "/static/management/views/phy_monitor_network.html",
                data: {pageTitle: 'Phy_Monitor_Network'},
                controller: "Phy_Monitor_NetworkController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/phy_monitor_network_ctrl.js'
                            ]
                        });
                    }]
                }
            })
