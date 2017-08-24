$(function() {
    "use strict";

    // setup brainbrowser widget.
    window.viewer = BrainBrowser.SurfaceViewer.start("brainbrowser", function(viewer) {

        // Add an event listener.
        viewer.addEventListener("displaymodel", function() {
            console.log("We have a model!");
        });

        // Start rendering the scene.
        viewer.render();

        // Load a model into the scene.
        viewer.loadModelFromURL("/assets/models/brain-surface1.obj");

        // Load a colormap
        viewer.loadColorMapFromURL("/assets/color-maps/spectral1.txt");

        // Hook viewer behaviour into UI.
        $("#wireframe").change(function(e) {
            viewer.setWireframe($(this).is(":checked"));
        });
    });
});
