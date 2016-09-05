/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //warning
          .state("warning", {
                url: "/warning/",
                templateUrl: "/static/management/views/warning.html",
                data: {pageTitle: 'Warning'},
                controller: "WarningController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/warning_ctrl.js'
                            ]
                        });
                    }]
                }
            })
