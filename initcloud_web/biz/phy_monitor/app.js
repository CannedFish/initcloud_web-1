/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //phy_monitor
          .state("phy_monitor", {
                url: "/phy_monitor/",
                templateUrl: "/static/management/views/phy_monitor.html",
                data: {pageTitle: 'Phy_Monitor'},
                controller: "Phy_MonitorController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/phy_monitor_ctrl.js'
                            ]
                        });
                    }]
                }
            })
