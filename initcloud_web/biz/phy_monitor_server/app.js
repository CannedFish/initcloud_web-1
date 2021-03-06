/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //phy_monitor_server
          .state("phy_monitor_server", {
                url: "/phy_monitor_server/",
                templateUrl: "/static/management/views/phy_monitor_server.html",
                data: {pageTitle: 'Phy_Monitor_Server'},
                controller: "Phy_Monitor_ServerController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/phy_monitor_server_ctrl.js'
                            ]
                        });
                    }]
                }
            })
