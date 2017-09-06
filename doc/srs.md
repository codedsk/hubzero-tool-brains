# Brain Analysis Tools Requirements Specification

### Goals

Allow a user to launch the brain analysis tool in their web browser and perform the following tasks:
  * Select a set of input images from a pre-supplied repository of images
  * Initiate an analysis run using chosen input images.
  * Visualize results of analysis in the web browser.


### Definitions

1. Category
2. Subcategory
3. GUI
4. Analysis Program
5. JSON
6. Weber Infrastructure
7. NodeJs


### Assumptions

1. Application will be accessible through the web browser
2. For the initial version of the application, users will only be able to select images from pre-supplied image repository. Users cannot upload their own images.
3. All computational processing will be served from and performed on diagrid.org
4. The application will be hosted inside of a diagrid.org tool container.
5. The web interface will be served from the tool container using the HUB's weber infrastructure and will run in the user's web browser.
6. External software needed by the graphical user interface and analysis program will be installed in the tool container.


### Input data

Pre-supplied image files will be stored in a directory structure where each directory represents a sub-category and holds between 700 and 1000 images. There are 48 sub-categories. The images use a numeric file name, starting at 1, which also doubles as the image's *index*. When filename is combined with the category name, the image an be uniquely identified. The category name and index are used by the analysis program to tie an image to a precalculated brain vector.


### Software

The application consists of a graphical user interface and an analysis program. The proposed application will be primarily written using HTML, CSS, JavaScript, and Python. NodeJs will be used to serve the web application. The server-side JavaScript will be repsonsible for manipulating the graphical user interface, retrieving inputs from the user, kicking off the Python based analysis jobs, capturing the results, and returning them back to the user via the graphical user interface.


### Around the graphical user interface

![Graphical user interface overview](https://cdn.rawgit.com/codedsk/hubzero-tool-brains/7dfc5e33/doc/images/gui_overview.svg)

The graphical user interface will be written in HTML, CSS, and JavaScript. The layout is broken into widgets which work together to allow users to view, select, and deselect images from the subcategories to create a request that can be given to the analysis program. After the analysis program completes, the graphical user interface will display the rendered results.

The graphical user interface widgets include:

1. The Subcategory Dropdown widget is a dropdown widget whose options are the subcategories of pre-selected images. When a user selects an option from the dropdown menu, the Input Selection Widget is updated with images from the chosen subcategory. 

![Subcategory Dropdown widget](https://cdn.rawgit.com/codedsk/hubzero-tool-brains/7dfc5e33/doc/images/subcat_dropdown_3.svg)


2. The Input Selection widget shows the images in the subcategory chosen in the Subcategory Dropdown widget. Images in this widget are not all loaded immediately becuase each subcategory can hold between 700 and 1000 images. Instead, this widget implements pagination or infinite scroll, where images are loaded upon request. Images can be selected by clicking on the image thumbnail. A selected image is gray'd out and can be unselected by clicking on the image a second time. Selecting an image updates a request object on the server, which is reflected in the Subcategory Request History widget. The widget contains a *Select All* checkbox to aid in selecting or deselecting all images in the subcategory. When the Subcategory Dropdown widget signals this widget to load images, those images that were selected as a part of a previous request will be shown in their selected state (gray'd out).

<span style="display:block;text-align:center">![Input Selection widget](https://cdn.rawgit.com/codedsk/hubzero-tool-brains/7dfc5e33/doc/images/input_selection_widget.svg)</span>


3. The Subcategory Request History widget shows the stored requests for each subcategory. Each request consists of a subcategory name and a list of selected images in the subcategory. The widget displays a list of links or button that consist of a subcategory name, the number of images chosen, and a cancel button. When a user selects images from the Image Selection widget, the subcategory and image counts in this widget are updated. Pressing on a link's cancel button will deselect all images for the subcategory in the request. Pressing on the link will set the category in the Subcategory Dropdown widget and load the selected images into the Input Selection widget.

![Subcategory Request History widget](https://cdn.rawgit.com/codedsk/hubzero-tool-brains/7dfc5e33/doc/images/subcat_request_history_widget.svg)


### Interfacing with the analysis program

The analysis program will be written in Python and will have an option to use the standard input (stdin) and standard output (stdout) file descriptors for communication. A common JSON wire protocol has been created to describe the inputs and outputs of a requested analysis.

Communication between the graphical user interface and the analysis program is initiated when the user presses the Simulate button, after choosing one or more subcategories and image files to run the analysis on. The graphical user interface will capture the user's choices and create a JSON object that represents the request. This JSON object is then handed off to the analysis program.

The JSON object that is passed from the graphical user interface to the analysis program holds a single key labeled *input*. The value of *input* is another object with a single key labeled *requests*. The value of the *requests* key is a list of objects, each with two keys labeled *subcategory* and *indices*. The *subcategory* key contains a string with the name of the subcategory of images this request object represents. The *indices* key contains a list of image file index numbers that were chosen by the user for the corresponding subcategory. Below is an example request for images from the *cat* subcategory with indices matching 1, 2, 7 and 9.

```json
{
  "input" : {
    "requests" : [
      {
        "subcategory" : "cat",
        "indices" : [1,2,7,9]
      }
    ]
  }
}
```

After completing, the analysis program will write its image results to disk in the present working directory as a JPG file and return the names of the output image files in a response string using the JSON wire protocol. The response string will build on the input string, adding an object, labeled *output*, that contains an object labeled *views*, that contains two key labeled *flat* and *stereo*. The *flat* key is a string holding the name of flattened view image. The *stereo* key is a string holding the name of stereo view image. Below is an example response with a *flat* image named flattened_view.jpg and a *stereo* image named stereo_view.jpg.

```json
{
  "input" : {
    "requests" : [
      {
        "subcategory" : "cat",
        "indices" : [1,2,7,9]
      }
    ]
  },
  "output" : {
    "views" : {
      "flat" : "flattened_view.jpg",
      "stereo" : "stereo_view.jpg”
    }
  }
}
```

Let's take a look at the typical workflows of the application.


### Wireflows: screenies and workflows

There are 4 common communication scenarios:
* User selects one subcategory and one or more images
* User selects multiple subcategories and multiple images
* User selects a one whole subcategory
* User modifies request

 
###### Single subcategory, single image workflow

![Wireflow diagram showing how the user would pick a single subcategory and multiple images from the graphical user interface](https://cdn.rawgit.com/codedsk/hubzero-tool-brains/7dfc5e33/doc/images/wireflow_single_subcategory_multiple_image.svg)

Through the graphical user interface, the user will be able to pick a single image to simulate with by performing the following tasks:

1. Pick an image subcategory from the drop down menu
2. Choose an image
3. Press "Simulate"

The NodeJs application will then read the inputs from the graphical user interface and perform the following tasks:

4. JSON input generated
5. Analysis program executed
6. JSON output parsed
7. Results shown in graphical user interface

For this scenario, the graphical user interface will produce the following JSON input for the analysis program:

```json
{
  "input" : {
    "requests" : [
      {
        "subcategory" : "cat",
        "indices" : [2]
      }
    ]
  }
}
```

And the analysis program will produce the following JSON output as a result to be processed by the graphical user interface:

```json
{
  "input" : {
    "requests" : [
      {
        "subcategory" : "cat",
        "indices" : [2]
      }
    ]
  },
  "output" : {
    "views" : {
      "flat" : "flattened_view.jpg",
      "stereo" : "stereo_view.jpg”
    }
  }
}
```

###### Multiple subcategory, multiple image workflow

![Wireflow showing how to add images from a second subcategory to a request.](https://cdn.rawgit.com/codedsk/hubzero-tool-brains/4d464de3/doc/images/wireflow_multiple_subcategory_multiple_image.svg)

Through the graphical user interface, the user will be able to pick and simulate multiple images from multiple subcategories with by performing the following tasks:

1. Pick an image subcategory from the drop down menu
2. Choose image(s)
3. Pick another image subcategory from the drop down menu
4. Choose image(s)
5. Press "Simulate"

The NodeJs application will then read the inputs from the graphical user interface and perform the following tasks:

6. JSON input generated
7. Analysis program executed
8. JSON output parsed
9. Results shown in graphical user interface

For this scenario, the graphical user interface will produce the following JSON input for the analysis program:

```json
{
  "input" : {
    "requests" : [
      {
        "subcategory" : "cat",
        "indices" : [1,2,7,9]
      },
      {
        "subcategory" : "sky",
        "indices" : [6,8,10]
      }
    ]
  }
}
```

And the analysis program will produce the following JSON output as a result to be processed by the graphical user interface:

```json
{
  "input" : {
    "requests" : [
      {
        "subcategory" : "cat",
        "indices" : [1,2,7,9]
      },
      {
        "subcategory" : "sky",
        "indices" : [6,8,10]
      }

    ]
  },
  "output" : {
    "views" : {
      "flat" : "flattened_view.jpg",
      "stereo" : "stereo_view.jpg”
    }
  }
}
```

###### Whole subcategory

![Wireflow showing how to add all images in a subcategory to a request.](https://cdn.rawgit.com/codedsk/hubzero-tool-brains/4d464de3/doc/images/wireflow_whole_subcategory.svg)

Through the graphical user interface, the user will be able to pick and simulate all images from a subcategory by performing the following tasks:


1. Pick an image subcategory from the drop down menu
2. Toggle the Select All checkbox
3. Press "Simulate"

The NodeJs application will then read the inputs from the graphical user interface and perform the following tasks:

4. JSON input generated
5. Analysis program executed
6. JSON output parsed
7. Results shown in graphical user interface

For this scenario, the graphical user interface will produce the following JSON input for the analysis program:

```json
{
  "input" : {
    "requests" : [
      {
        "subcategory" : "cat",
        "indices" : []
      }
    ]
  }
}
```

And the analysis program will produce the following JSON output as a result to be processed by the graphical user interface:

```json
{
  "input" : {
    "requests" : [
      {
        "subcategory" : "cat",
        "indices" : []
      }
    ]
  },
  "output" : {
    "views" : {
      "flat" : "flattened_view.jpg",
      "stereo" : "stereo_view.jpg”
    }
  }
}
```


###### Modify request

![Wireflow showing how to modify a request to add or remove images in a subcategory, or remove all images in the subcategory.](https://cdn.rawgit.com/codedsk/hubzero-tool-brains/4d464de3/doc/images/wireflow_modify_request.svg)

Through the graphical user interface, the user will be able to pick and simulate all images from a subcategory by performing the following tasks:

1. Click stored request link for first request
2. Unchoose image(s)

or

1. Click the ![cancel sign'](https://cdn.rawgit.com/codedsk/hubzero-tool-brains/7685172c/doc/images/cancel_sign.svg) for a stored request to unchoose all images in the subcategory.

then 

3. Press "Simulate"


### Future Work

1. User uploaded images
The graphical user interface can be expanded to support user uploaded images by providing an "Upload" option to the subcategory dropdown menu. When the user chooses the "Upload" option, they will be presented with an browser upload dialog window, where they can choose an image file or compressed archive to upload to the application's disk space in the user's HUB drive. The graphical user interface give the newly uploaded data a unique subcategory name, uncompress the the uploaded file if compressed, and begin serving the uploaded images to the image selection widget. The subcategory dropdown menu will be updated to show the new unique subcategory name. The user will select images from the image selection widget and these selections will be stored as requests, both in the request history widget and in the JSON input string, just like selections from the cached image store. When the analysis code receives requests for user uploaded images, the analysis code will need to generate brain vectors for the images, then average the vectors, and render the results.

2. Using Tags instead of Subcategories
Perhaps store images and tags as nodes in a graph database. Edges show relationship between images and tags. Users can search using tags in the subcategory dropdown menu. The image selection widget will be populated with images that are connected to the specified tags.  When an image is picked from the image selection widget, a new edge will be created in the database between the image node and the special "selected" node. May also need special "tags" and "images" nodes that point to which nodes are tags and which nodes are images. When the user presses the simulate button, the serverside JavaScript will launch the Python analysis program. The analysis program will connect to the graph database, locate the "selected" node, and traverse the node's edges to find the images selected by the user. The analysis program will perform its analysis and render result images, whose file names will be returned to the serverside JavaScript through the JSON data protocol on stdard output.

3. Larger Input Selection widget
The current input selection widget is very restrictive in how many images can be viewed at one time. It currently implements an infinite scroll scheme to reduce the amount of image data that needs to be transfered from the server to the client when the application initially loads and when a new subcategory is chosen. A redesigned application should consider making this area larger. Examples of larger image viewing widgets include image search provided by https://flickr.com and https://images.google.com
