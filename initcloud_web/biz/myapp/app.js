/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //myapp
          .state("myapp", {
                url: "/myapp/",
                templateUrl: "/static/management/views/myapp.html",
                data: {pageTitle: 'Myapp'},
                controller: "MyappController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/myapp_ctrl.js'
                            ]
                        });
                    }]
                }
            })
