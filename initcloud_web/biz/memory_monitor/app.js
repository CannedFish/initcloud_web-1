/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //memory_monitor
          .state("memory_monitor", {
                url: "/memory_monitor/",
                templateUrl: "/static/management/views/memory_monitor.html",
                data: {pageTitle: 'Memory_Monitor'},
                controller: "Memory_MonitorController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/memory_monitor_ctrl.js'
                            ]
                        });
                    }]
                }
            })
