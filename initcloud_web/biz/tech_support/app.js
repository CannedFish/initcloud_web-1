/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //tech_support
          .state("tech_support", {
                url: "/tech_support/",
                templateUrl: "/static/management/views/tech_support.html",
                data: {pageTitle: 'Tech_Support'},
                controller: "Tech_SupportController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/tech_support_ctrl.js'
                            ]
                        });
                    }]
                }
            })
