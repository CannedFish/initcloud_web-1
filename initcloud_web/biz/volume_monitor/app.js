/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //volume_monitor
          .state("volume_monitor", {
                url: "/volume_monitor/",
                templateUrl: "/static/management/views/volume_monitor.html",
                data: {pageTitle: 'Volume_Monitor'},
                controller: "Volume_MonitorController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/volume_monitor_ctrl.js'
                            ]
                        });
                    }]
                }
            })
