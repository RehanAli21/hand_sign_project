# Information about this folder

## Purpose of this folder

This folder is for training model on data we got after detecting hands data from python which has 127 columns.

The folder hierarchy for data storing will be

-   nodeimagelist
-   -- imagesData
-   ---- 18000
-   ------ detectionData1.json
-   ------ detectionData2.json
-   ------ detectionData3.json

##### There are 3 parts for detectionData becaus json.load module was not able to access all data together.

##### 18000 folder represents that in this folder's data every category has 18000 rows

## Technologies

-   tensorflow node
-   tensorflow node wasm backend
-   gracefull-fs
-   Note: to install tensorflowjs node, deveoper must have install node with python and vs build tools (node automatically install this on selecting install chocolatey in install options)
