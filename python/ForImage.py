import mediapipe as mp
import json
import os

model_path = '/absolute/path/to/gesture_recognizer.task'

BaseOptions = mp.tasks.BaseOptions
HandLandmarker = mp.tasks.vision.HandLandmarker
HandLandmarkerOptions = mp.tasks.vision.HandLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

detectionData = []

# Create a hand landmarker instance with the image mode:
options = HandLandmarkerOptions(
    base_options=BaseOptions(model_asset_path='./model/hand_landmarker.task'),
    running_mode=VisionRunningMode.IMAGE)

dirs = os.listdir('./images')

with HandLandmarker.create_from_options(options) as landmarker:
  # three ranges (0, 6), (6, 12), (12, 18) for dividing data into three parts
  for dirIndex in range(0, 6): 
    dir = dirs[dirIndex]
    print("directory: ", dir)

    imgs = os.listdir('./images/'+dir)

    for img in imgs:
       imgPath = "./images/"+dir+"/"+img

       mp_image = mp.Image.create_from_file(imgPath)
       result = landmarker.detect(mp_image)

       if (len(result.handedness) == 1):
         arr = []

         arr.append(result.handedness[0][0].index) # index is telling which hand side is this

         for li in range(len(result.hand_landmarks)):
            for cord in result.hand_landmarks[li]:
               arr.append(cord.x)
               arr.append(cord.y)
               arr.append(cord.z)

         for li in range(len(result.hand_world_landmarks)):
            for cord in result.hand_world_landmarks[li]:
               arr.append(cord.x)
               arr.append(cord.y)
               arr.append(cord.z)

         arr.append(dir.split('val_')[1])

         detectionData.append(arr)

print(len(detectionData))

# for these three ranges (0, 6), (6, 12), (12, 18) the saving file respectivly detectionData1.json, detectionData2.json, detectionData3.json
file = open("./imagesData/detectionData1.json", 'w')

json.dump(detectionData, file)

file.close()
  
  

  
    