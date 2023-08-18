import json

data = []

#Preprocessing 3 files separately detectionData1.json, detectionData2.json, detectionData3.json
fileName = "detectionData1.json"

path = "./imagesData/"+fileName

file = open(path, 'r')

data1 = json.load(file)
print(len(data1))
print(len(data1[0]))

for i in range(len(data1)):
    data.append(data1[i])

file.close()

labels = {}
newData = []

def findLabel(yElement):
    for label in labels:
        if label == yElement:
            return True
    return False

for i in range(len(data)):
    e = data[i]

    yElement = e[-1]

    if findLabel(yElement):
        if labels[yElement] < 18000:
            labels[yElement] += 1
            newData.append(data[i])
    else:
        labels[yElement] = 1
        newData.append(data[i])

print(labels)
print(len(newData))

data = 0

path = "./imagesData/18000/"+fileName

file = open(path, 'w')
data = json.dump(newData, file)
file.close()
