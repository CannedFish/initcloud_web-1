/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //cabinet
          .state("cabinet", {
                url: "/cabinet/",
                templateUrl: "/static/management/views/cabinet.html",
                data: {pageTitle: 'Cabinet'},
                controller: "CabinetController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/cabinet_ctrl.js'
                            ]
                        });
                    }]
                }
            })
