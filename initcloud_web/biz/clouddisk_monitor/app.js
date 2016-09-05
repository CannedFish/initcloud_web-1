/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //clouddisk_monitor
          .state("clouddisk_monitor", {
                url: "/clouddisk_monitor/",
                templateUrl: "/static/management/views/clouddisk_monitor.html",
                data: {pageTitle: 'Clouddisk_Monitor'},
                controller: "Clouddisk_MonitorController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/clouddisk_monitor_ctrl.js'
                            ]
                        });
                    }]
                }
            })
