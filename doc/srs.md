# Brain Analysis Tools System and Software Requirements Specification

### Introduction

### System
#### Goals
1. allow a user to launch the brain analysis tool in their web browser
2. select a set of input images from a pre-supplied repository of images
3. initiate an analysis run using chosen input images
4. visualize results of analysis in the web browser.
#### Definitions
1. Category
2. Subcategory
3. GUI
4. Analysis Program
5. JSON
6. Weber Infrastructure
7. NodeJs

#### Assumptions
1. Application will be accessible through the web browser
2. For the initial version of the application, users will only be able to select images from pre-supplied image repository. Users cannot upload their own images.
3. All computational processing will be served from and performed on diagrid.org

#### Environment
1. The application will be hosted inside of a diagrid.org tool container.
2. The web interface will be served from the tool container using the HUB's weber infrastructure and will run in the user's web browser.
3. External software needed by the graphical user interface and analysis program will be installed in the tool container.

#### Data
1. Pre-supplied image files will be stored in a directory structure.
2. Each directory represents a sub-category that holds between 700 and 1000 images. There are 48 sub-categories.

#### Software
There are two main parts to the application:
1. Graphical user interface
2. Analysis Program

This section discusses the software behind the application, how the user interacts with the application and how the user's input choices are turned into results.
The proposed application will be primarily written using HTML, CSS, JavaScript, and Python. NodeJs will be used to serve the web application. The serverside JavaScript will be repsonsible for manipulating the graphical user interface, retrieving inputs from the user, kicking off the Python based analysis jobs, and capturing and returning the results back to the user via the graphical user interface.

Let's take a look at the typical workflows of the application.

#### Around the graphical user interface
Show image of fully populated graphical user interface (inputs and outputs) with arrows and though balloons telling what the different parts of the GUI are and how the user can interact with them.

##### Wireflows: screenies and workflows

###### Single category, single image workflow
1. Pick an image subcategory from the drop down menu
2. Choose an image
3. Simulate
4. JSON input
5. Analysis program
6. JSON output
7. Results

###### Single subcategory, multiple image workflow
1. Pick an image subcategory from the drop down menu
2. Choose multiple images
3. Simulate
4. JSON input
5. Analysis program
6. JSON output
7. Results

###### Multiple subcategory, multiple image workflow
1. Pick an image subcategory from the drop down menu
2. Choose image(s)
3. Pick an image subcategory from the drop down menu
4. Choose image(s)
3. Simulate
4. JSON input
5. Analysis program
6. JSON output
7. Results

###### Whole subcategory
1. Pick an image subcategory from the drop down menu
2. Toggle the Select All checkbox
2.5 Optionally repeat for multiple subcategories
3. Simulate
4. JSON input
5. Analysis program
6. JSON output
7. Results

###### Modify request
1. Pick an image subcategory from the drop down menu
2. Choose image(s)
3. Pick an image subcategory from the drop down menu
4. Choose image(s)
5. Click stored request link for first request
6. Unchoose image(s)
3. Simulate
4. JSON input
5. Analysis program
6. JSON output
7. Results




##### Graphical User Interface
Written in HTML, CSS, JavaScript.

###### GUI widgets

##### Analysis Program
Written in Python. Speaks the JSON data protocol to accept input choices and return output results. Calls Connectome Workbench through a system call.

Analysis program is responsible for retrieving cached analysis results, refered to as a brain vector, for pre-selected images, averaging the brain vectors, and calling Connectome Workbench to render the results.

### Future Work

1. User uploaded images
The graphical user interface can be expanded to support user uploaded images by providing an "Upload" option to the subcategory dropdown menu. When the user chooses the "Upload" option, they will be presented with an browser upload dialog window, where they can choose an image file or compressed archive to upload to the application's disk space in the user's HUB drive. The graphical user interface give the newly uploaded data a unique subcategory name, uncompress the the uploaded file if compressed, and begin serving the uploaded images to the image selection widget. The subcategory dropdown menu will be updated to show the new unique subcategory name. The user will select images from the image selection widget and these selections will be stored as requests, both in the request history widget and in the JSON input string, just like selections from the cached image store. When the analysis code receives requests for user uploaded images, the analysis code will need to generate brain vectors for the images, then average the vectors, and render the results.

2. Using Tags instead of Subcategories
Perhaps store images and tags as nodes in a graph database. Edges show relationship between images and tags. Users can search using tags in the subcategory dropdown menu. The image selection widget will be populated with images that are connected to the specified tags.  When an image is picked from the image selection widget, a new edge will be created in the database between the image node and the special "selected" node. May also need special "tags" and "images" nodes that point to which nodes are tags and which nodes are images. When the user presses the simulate button, the serverside JavaScript will launch the Python analysis program. The analysis program will connect to the graph database, locate the "selected" node, and traverse the node's edges to find the images selected by the user. The analysis program will perform its analysis and render result images, whose file names will be returned to the serverside JavaScript through the JSON data protocol on stdard output.
