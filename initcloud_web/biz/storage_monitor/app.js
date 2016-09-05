/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //storage_monitor
          .state("storage_monitor", {
                url: "/storage_monitor/",
                templateUrl: "/static/management/views/storage_monitor.html",
                data: {pageTitle: 'Storage_Monitor'},
                controller: "Storage_MonitorController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/storage_monitor_ctrl.js'
                            ]
                        });
                    }]
                }
            })
