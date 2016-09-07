(function() {
  angular.module('abn.tree', [])
  .directive('abnTree', [ 
    '$timeout','$compile', function($timeout,$compile) {
        // 模板定义:
        /*
        1.ul:定义树的包裹 abn-tree:
        2.li: ng-repeat； row in tree_rows | filter:{visiable:true} track by row.branch.uid
         */
      return {
        restrict: 'E',//元素
        // This happens before it is bound to the scope, so that is why no scope
        // is injected
        templateUrl:"../static/management/views/network_bar_net_treeview.html",
        replace: true,
        scope: {
          treeData: '=',//数据绑定
          treeName: '=',//数据绑定
          onSelect: '&',//方法绑定
          initialSelection: '@',//”@“：指令中的取值为html中的字面量/直接量；建立一个local scope property到DOM属性的绑定。
          treeControl: '='//数据绑定
        },
        link: function(scope, element, attrs) {
          // console.log(my_data);
          var error, 
          expand_all_parents, 
          expand_level, 
          for_all_ancestors, 
          for_each_branch, 
          get_parent, n, 
          on_treeData_change, 
          select_branch, 
          selected_branch, 
          tree;//自定义方法和常用函数
          error = function(s) {
            console.log('ERROR:' + s);
            debugger;
            return void 0;
          };
         //设置ico 图标
          if (attrs.iconExpand == null) {
            attrs.iconExpand = 'icon-plus  glyphicon glyphicon-plus  fa fa-plus';
          }
          if (attrs.iconCollapse == null) {
            attrs.iconCollapse = 'icon-minus glyphicon glyphicon-minus fa fa-minus';
          }
          if (attrs.iconLeaf == null) {
            attrs.iconLeaf = 'icon-file  glyphicon glyphicon-file  fa fa-file';
          }
          if (attrs.expandLevel == null) {
            attrs.expandLevel = '3';
          }
          //树的层次 （parseInt:解析成整数）
          expand_level = parseInt(attrs.expandLevel, 10);
          //判断树中的数据
          // if (!scope.treeData) {
          //   alert('no treeData defined for the tree!');
          //   return;
          // }
          //长度
          // if (scope.treeData.length == null) {
          //   if (treeData.label != null) {
          //     scope.treeData = [treeData]; //给树赋值

          //   } else {
          //     alert('treeData should be an array of root branches');
          //     return;
          //   }
          // }
          //便利树分支（参数:回调函数）
          for_each_branch = function(f) {
            var do_f, root_branch, _i, _len, _ref, _results;
            //执行回调函数
            do_f = function(branch, level) {
                var child, _i, _len, _ref, _results;
                f(branch, level);//function
                if (branch.children != null) {
                    _ref = branch.children;//给叶子节点赋值
                    _results = [];//置空结果数组
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        child = _ref[_i];//循环便利构造子节点
                        _results.push(do_f(child, level + 1));
                    }
                return _results;
              }
            };
            // 先执行 划分根节点
            _ref = scope.treeData; //
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              root_branch = _ref[_i];//分割树的分支
              _results.push(do_f(root_branch, 1));
            }
            return _results;
          };

          //1.执行。
          selected_branch = null;
          //选择分支
          select_branch = function(branch) {
            if (!branch) {
                if (selected_branch != null) {
                    selected_branch.selected = false;
                }
                selected_branch = null;
                return;
            }
            if (branch !== selected_branch) {
                //状态判断
                if (selected_branch != null) {
                    selected_branch.selected = false;
                }
                branch.selected = true;
                // 
                selected_branch = branch;
                expand_all_parents(branch);
              if (branch.onSelect != null) {
                return $timeout(function() {
                  return branch.onSelect(branch);
                });
              } else {
                if (scope.onSelect != null) {
                  return $timeout(function() {
                    return scope.onSelect({
                      branch: branch
                    });
                  });
                }
              }
            }
          };
          scope.user_clicks_branch = function(branch) {
            if (branch !== selected_branch) {
              return select_branch(branch);
            }
          };
          get_parent = function(child) {
            var parent;
            parent = void 0;
            if (child.parent_uid) {
              for_each_branch(function(b) {
                if (b.uid === child.parent_uid) {
                  return parent = b;
                }
              });
            }
            return parent;
          };

          // 一组: 1.状态扩展传播到所有的父级元素 (所有的父级元素都可扩展 b.expanded = true;)
          for_all_ancestors = function(child, fn) {
            var parent;
            parent = get_parent(child);//根据孩子节点查找父亲节点
            if (parent != null) {
              fn(parent);//回调 function(){}() b.expanded = true;
              return for_all_ancestors(parent, fn);
            }
          };
          expand_all_parents = function(child) { //参数:当前的孩子节点
            return for_all_ancestors(child, function(b) {
              return b.expanded = true;
            });
          };

          // 
          scope.tree_rows = []; //定义树行
          // 树状态检测函数
          on_treeData_change = function() {
            var add_branch_to_list, //添加分支到列表
                root_branch, _i, _len, _ref, _results;
                for_each_branch(function(b, level) {
                    if(!b.uid) {
                        return b.uid = "" + Math.random();
                    }
                });
                console.log('UIDs are set.');
                for_each_branch(function(b) {
                    var child, _i, _len, _ref, _results;
                    if (angular.isArray(b.children)) {
                        _ref = b.children;
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            child = _ref[_i];
                            _results.push(child.parent_uid = b.uid);
                        }
                    return _results;
                  }
                });
                scope.tree_rows = [];
                for_each_branch(function(branch) {
                    var child, f;
                    if (branch.children){
                        if (branch.children.length > 0) {
                            f = function(e) {
                                if (typeof e === 'string'){
                                    return {
                                        label: e,
                                        children: []
                                    };
                                }else{
                                    return e;
                                }
                            };
                            return branch.children = (function() {
                                var _i, _len, _ref, _results;
                                 _ref = branch.children;
                                _results = [];
                                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                    child = _ref[_i];
                                     _results.push(f(child));
                                }
                                return _results;
                            })();
                        }
                   }else{
                        return branch.children = [];
                   }
                });

            // ----------------------
            add_branch_to_list = function(level, branch, visible) {
              var child, child_visible, tree_icon, _i, _len, _ref, _results;
              if (branch.expanded == null) {
                branch.expanded = false;
              }
              if (!branch.children || branch.children.length === 0) {
                tree_icon = attrs.iconLeaf;
              } else {
                if (branch.expanded) {
                  tree_icon = attrs.iconCollapse;
                } else {
                  tree_icon = attrs.iconExpand;
                }
              }
              scope.tree_rows.push({
                level: level,
                branch: branch,
                label: branch.label,
                tree_icon: tree_icon,
                visible: visible
              });
              if (branch.children != null) {
                _ref = branch.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  child_visible = visible && branch.expanded;
                  _results.push(add_branch_to_list(level + 1, child, child_visible));
                }
                //添加
                return _results;
              }
            };
            _ref = scope.treeData;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              root_branch = _ref[_i];
              _results.push(add_branch_to_list(1, root_branch, true));
            }
            return _results;
          };
          scope.$watch('treeData', on_treeData_change, true);
          if (attrs.initialSelection != null) {
            for_each_branch(function(b) {
              if (b.label === attrs.initialSelection) {
                return $timeout(function() {
                  return select_branch(b);
                });
              }
            });
          }
          n = scope.treeData.length;
          console.log('num root branches = ' + n);
          for_each_branch(function(b, level) {
            b.level = level;
            return b.expanded = b.level < expand_level;
          });
          if (scope.treeControl != null) {
            if (angular.isObject(scope.treeControl)) {
              tree = scope.treeControl;
              tree.expand_all = function() {
                return for_each_branch(function(b, level) {
                  return b.expanded = true;
                });
              };
              tree.collapse_all = function() {
                return for_each_branch(function(b, level) {
                  return b.expanded = false;
                });
              };
              tree.get_first_branch = function() {
                n = scope.treeData.length;
                if (n > 0) {
                  return scope.treeData[0];
                }
              };
              tree.select_first_branch = function() {
                var b;
                b = tree.get_first_branch();
                return tree.select_branch(b);
              };
              tree.get_selected_branch = function() {
                return selected_branch;
              };
              tree.get_parent_branch = function(b) {
                return get_parent(b);
              };
              tree.select_branch = function(b) {
                select_branch(b);
                return b;
              };
              tree.get_children = function(b) {
                return b.children;
              };
              tree.select_parent_branch = function(b) {
                var p;
                if (b == null) {
                  b = tree.get_selected_branch();
                }
                if (b != null) {
                  p = tree.get_parent_branch(b);
                  if (p != null) {
                    tree.select_branch(p);
                    return p;
                  }
                }
              };
              tree.add_branch = function(parent, new_branch) {
                if (parent != null) {
                  parent.children.push(new_branch);
                  parent.expanded = true;
                } else {
                  scope.treeData.push(new_branch);
                }
                return new_branch;
              };
              tree.add_root_branch = function(new_branch) {
                tree.add_branch(null, new_branch);
                return new_branch;
              };
              tree.expand_branch = function(b) {
                if (b == null) {
                  b = tree.get_selected_branch();
                }
                if (b != null) {
                  b.expanded = true;
                  return b;
                }
              };
              tree.collapse_branch = function(b) {
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  b.expanded = false;
                  return b;
                }
              };
              tree.get_siblings = function(b) {
                var p, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  p = tree.get_parent_branch(b);
                  if (p) {
                    siblings = p.children;
                  } else {
                    siblings = scope.treeData;
                  }
                  return siblings;
                }
              };
              tree.get_next_sibling = function(b) {
                var i, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  siblings = tree.get_siblings(b);
                  n = siblings.length;
                  i = siblings.indexOf(b);
                  if (i < n) {
                    return siblings[i + 1];
                  }
                }
              };
              tree.get_prev_sibling = function(b) {
                var i, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                siblings = tree.get_siblings(b);
                n = siblings.length;
                i = siblings.indexOf(b);
                if (i > 0) {
                  return siblings[i - 1];
                }
              };
              tree.select_next_sibling = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_next_sibling(b);
                  if (next != null) {
                    return tree.select_branch(next);
                  }
                }
              };
              tree.select_prev_sibling = function(b) {
                var prev;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev = tree.get_prev_sibling(b);
                  if (prev != null) {
                    return tree.select_branch(prev);
                  }
                }
              };
              tree.get_first_child = function(b) {
                var _ref;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  if (((_ref = b.children) != null ? _ref.length : void 0) > 0) {
                    return b.children[0];
                  }
                }
              };
              tree.get_closest_ancestor_next_sibling = function(b) {
                var next, parent;
                next = tree.get_next_sibling(b);
                if (next != null) {
                  return next;
                } else {
                  parent = tree.get_parent_branch(b);
                  return tree.get_closest_ancestor_next_sibling(parent);
                }
              };
              tree.get_next_branch = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_first_child(b);
                  if (next != null) {
                    return next;
                  } else {
                    next = tree.get_closest_ancestor_next_sibling(b);
                    return next;
                  }
                }
              };
              tree.select_next_branch = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_next_branch(b);
                  if (next != null) {
                    tree.select_branch(next);
                    return next;
                  }
                }
              };
              tree.last_descendant = function(b) {
                var last_child;
                if (b == null) {
                  debugger;
                }
                n = b.children.length;
                if (n === 0) {
                  return b;
                } else {
                  last_child = b.children[n - 1];
                  return tree.last_descendant(last_child);
                }
              };
              tree.get_prev_branch = function(b) {
                var parent, prev_sibling;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev_sibling = tree.get_prev_sibling(b);
                  if (prev_sibling != null) {
                    return tree.last_descendant(prev_sibling);
                  } else {
                    parent = tree.get_parent_branch(b);
                    return parent;
                  }
                }
              };
              return tree.select_prev_branch = function(b) {
                var prev;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev = tree.get_prev_branch(b);
                  if (prev != null) {
                    tree.select_branch(prev);
                    return prev;
                  }
                }
              };
            }
          }
        }
      };
    }
  ]);

}).call(this);
