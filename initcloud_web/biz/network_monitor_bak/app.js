/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //network_monitor
          .state("network_monitor", {
                url: "/network_monitor/",
                templateUrl: "/static/management/views/network_monitor.html",
                data: {pageTitle: 'Network_Monitor'},
                controller: "Network_MonitorController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/network_monitor_ctrl.js'
                            ]
                        });
                    }]
                }
            })
