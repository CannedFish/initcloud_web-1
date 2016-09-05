/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //network_bar
          .state("network_bar", {
                url: "/network_bar/",
                templateUrl: "/static/management/views/network_bar.html",
                data: {pageTitle: 'Network_Bar'},
                controller: "Network_BarController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/network_bar_ctrl.js'
                            ]
                        });
                    }]
                }
            })
