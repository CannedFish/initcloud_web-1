/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //service_bar
          .state("service_bar", {
                url: "/service_bar/",
                templateUrl: "/static/management/views/service_bar.html",
                data: {pageTitle: 'Service_Bar'},
                controller: "Service_BarController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/service_bar_ctrl.js'
                            ]
                        });
                    }]
                }
            })
