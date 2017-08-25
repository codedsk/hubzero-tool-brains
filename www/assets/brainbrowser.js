$(function() {
    "use strict";

    var THREE = BrainBrowser.SurfaceViewer.THREE;

    // setup brainbrowser widget.
    window.viewer = BrainBrowser.SurfaceViewer.start("brainbrowser", function(viewer) {

        // Add an event listener.
        viewer.addEventListener("displaymodel", function() {
            console.log("We have a model!");
        });

        // Start rendering the scene.
        viewer.render();


        // Load the dbs model into the scene.
        // This will load 3 surfaces into the viewer:
        //   dbs.json
        //   dbs-fibers.json
        //   dbs-vat.json


        viewer.annotations.setMarkerRadius(0.3);
        viewer.loadModelFromURL("/assets/models/dbs.json", {
            format: "json",
            complete: function() {
                var i;

                for (i = 17; i <= 93; i++) {
                    viewer.setTransparency(0.8, {
                        shape_name: "dbs.json_" + 1
                    });
                }
            }
        });

        viewer.loadModelFromURL("/assets/models/dbs-fibers.json", {
          format: "json",
          complete: function() {
            var i;

            for (i = 1; i <= 664; i++) {
              viewer.setTransparency(0.6, {
                shape_name: "dbs-fibers.json_" + i
              });
            }
          }
        });

        viewer.loadModelFromURL("/assets/models/dbs-vat.json", {
          format: "json"
        });

        viewer.zoom = 1.8;

        var matrixRotX, matrixRotY, matrixRotZ;
        matrixRotX = new THREE.Matrix4();
        matrixRotX.makeRotationX(-0.5 * Math.PI);
        matrixRotY = new THREE.Matrix4();
        matrixRotY.makeRotationY(-0.8 * Math.PI);
        matrixRotZ = new THREE.Matrix4();
        matrixRotZ.makeRotationZ(-0.1 * Math.PI);

        viewer.model.applyMatrix(matrixRotY.multiply(matrixRotZ.multiply(matrixRotX)));

        /// end dbs model


        // Load a colormap
        viewer.loadColorMapFromURL("/assets/color-maps/spectral1.txt");

        // Hook viewer behaviour into UI.
        $("#wireframe").change(function(e) {
            viewer.setWireframe($(this).is(":checked"));
        });
    });
});
