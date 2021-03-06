/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //service__bar
          .state("service__bar", {
                url: "/service__bar/",
                templateUrl: "/static/management/views/service__bar.html",
                data: {pageTitle: 'Service__Bar'},
                controller: "Service__BarController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/service__bar_ctrl.js'
                            ]
                        });
                    }]
                }
            })
