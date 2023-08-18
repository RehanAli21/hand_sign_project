# Information

This folder is for collecting detection data from images using mediapipe hand detection model and storing that data into 3 json files for trainig AI model in NodeImageList folder using TensorflowJS

Dataset Link: https://www.kaggle.com/datasets/innominate817/hagrid-sample-500k-384p

copy all the category folders from "hagrid_500k" (from dataset) folder and paste into images folder

#### The Hiearchy for images should be

(NOTE: categories order does not matter inside images folder)

-   images
-   -   train_val_call
-   -   -   imgs (all images in jpg)
-   -   train_val_dislike
-   -   -   imgs (all images in jpg)
-   -   train_val_fist
-   -   -   imgs (all images in jpg)
-   -   train_val_four
-   -   -   imgs (all images in jpg)
-   -   train_val_like
-   -   -   imgs (all images in jpg)
-   -   train_val_mute
-   -   -   imgs (all images in jpg)
-   -   train_val_ok
-   -   -   imgs (all images in jpg)
-   -   train_val_one
-   -   -   imgs (all images in jpg)
-   -   train_val_palm
-   -   -   imgs (all images in jpg)
-   -   train_val_peace
-   -   -   imgs (all images in jpg)
-   -   train_val_peace_inverted
-   -   -   imgs (all images in jpg)
-   -   train_val_rock
-   -   -   imgs (all images in jpg)
-   -   train_val_stop
-   -   -   imgs (all images in jpg)
-   -   train_val_stop_inverted
-   -   -   imgs (all images in jpg)
-   -   train_val_three
-   -   -   imgs (all images in jpg)
-   -   train_val_three2
-   -   -   imgs (all images in jpg)
-   -   train_val_two_up
-   -   -   imgs (all images in jpg)
-   -   train_val_two_up_inverted
-   -   -   imgs (all images in jpg)

## ForImage.py

This file use mediapipe to detect hand land marks and save them into json files

#### The data has 18 hand gesture categories

## preprocessing.py

This file load data from json files and reduce rows of each category to 18000, so that AI model could train better
