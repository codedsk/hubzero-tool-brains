// jstree examples:
// https://github.com/vakata/jstree/blob/master/demo/basic/index.html
// https://www.jstree.com/demo/

$(function() {
    "use strict";

    var tree = $('#categories');

    tree.jstree({
        "core" : {
            "multiple" : false,
            "data" : [
                { "text" : "Biological Objects",
                  "children" : [
                      { "text" : "Cats" },
                      { "text" : "Dogs",
                        "state" : { "opened" : true, "selected" : true }
                      },
                      { "text" : "Humans"},
                      { "text" : "Ants" }
                  ]
                },
                { "text" : "Non-Biological Objects",
                  "children" : [
                      { "text" : "Bricks" },
                      { "text" : "Metal Beams"},
                      { "text" : "Signs" },
                      { "text" : "Statues"}
                  ]
                },
                { "text" : "Background Scenes",
                  "children" : [
                      { "text" : "City Scapes" },
                      { "text" : "Fields"},
                      { "text" : "Mountains"},
                      { "text" : "Parks" },
                      { "text" : "Rivers" }
                  ]
                }
            ]
        },
        "checkbox" : {
            "visible" : true,
            "keep_selected_style" : false
        },
        "plugins" : ["checkbox"]
    });

    tree.on("changed.jstree", function(e, data) {
        console.log(data.selected);
    });

});
