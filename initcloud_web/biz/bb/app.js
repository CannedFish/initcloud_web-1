/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //bb
          .state("bb", {
                url: "/bb/",
                templateUrl: "/static/management/views/bb.html",
                data: {pageTitle: 'Bb'},
                controller: "BbController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/bb_ctrl.js'
                            ]
                        });
                    }]
                }
            })
