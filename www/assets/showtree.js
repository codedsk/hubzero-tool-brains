// jstree examples:
// https://github.com/vakata/jstree/blob/master/demo/basic/index.html
// https://www.jstree.com/demo/

$(function() {
    "use strict";

    var tree = $('#categories');

    tree.jstree({
        'core' : {
            'data' : [
                { "text" : "Root node",
                  "children" : [
                      { "text" : "Child node 1" },
                      { "text" : "Child node 2",
                        "children" : [
                            { "text" : "Grandchild node 1" },
                            { "text" : "Grandchild node 2" },
                            { "text" : "Grandchild node 3" }
                        ]
                      },
                      { "text" : "Child node 3" },
                      { "text" : "Child node 4" }
                  ]
                }
            ]
        }
    });

    tree.on("changed.jstree", function(e, data) {
        console.log(data.selected);
    });

});
