/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //login
          .state("login", {
                url: "/login/",
                templateUrl: "/static/management/views/login.html",
                data: {pageTitle: 'Login'},
                controller: "LoginController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/login_ctrl.js'
                            ]
                        });
                    }]
                }
            })
