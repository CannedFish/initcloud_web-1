/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //virtualmechine_bar
          .state("virtualmechine_bar", {
                url: "/virtualmechine_bar/",
                templateUrl: "/static/management/views/virtualmechine_bar.html",
                data: {pageTitle: 'Virtualmechine_Bar'},
                controller: "Virtualmechine_BarController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/virtualmechine_bar_ctrl.js'
                            ]
                        });
                    }]
                }
            })
