/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //storage__bar
          .state("storage__bar", {
                url: "/storage__bar/",
                templateUrl: "/static/management/views/storage__bar.html",
                data: {pageTitle: 'Storage__Bar'},
                controller: "Storage__BarController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/storage__bar_ctrl.js'
                            ]
                        });
                    }]
                }
            })
