/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //vm_monitor
          .state("vm_monitor", {
                url: "/vm_monitor/",
                templateUrl: "/static/management/views/vm_monitor.html",
                data: {pageTitle: 'Vm_Monitor'},
                controller: "Vm_MonitorController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/vm_monitor_ctrl.js'
                            ]
                        });
                    }]
                }
            })
