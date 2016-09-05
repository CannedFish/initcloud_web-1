/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //cloud_monitor_detail
          .state("cloud_monitor_detail", {
                url: "/cloud_monitor_detail/",
                templateUrl: "/static/management/views/cloud_monitor_detail.html",
                data: {pageTitle: 'Cloud_Monitor_Detail'},
                controller: "Cloud_Monitor_DetailController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/cloud_monitor_detail_ctrl.js'
                            ]
                        });
                    }]
                }
            })
