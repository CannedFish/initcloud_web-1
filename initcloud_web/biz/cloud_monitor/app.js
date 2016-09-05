/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //cloud_monitor
          .state("cloud_monitor", {
                url: "/cloud_monitor/",
                templateUrl: "/static/management/views/cloud_monitor.html",
                data: {pageTitle: 'Cloud_Monitor'},
                controller: "Cloud_MonitorController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/cloud_monitor_ctrl.js'
                            ]
                        });
                    }]
                }
            })
