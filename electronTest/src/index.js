const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { pressW, pressS, pressA, pressD } = require('../build/Release/keyInput')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	app.quit()
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	})

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'))

	// Open the DevTools.
	mainWindow.webContents.openDevTools()
}

let cameraWindow
const createCameraWindow = () => {
	cameraWindow = new BrowserWindow({
		width: 1000,
		height: 600,
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
			backgroundThrottling: true,
		},
	})

	cameraWindow.loadFile(path.join(__dirname, 'renderer', 'camera.html'))

	cameraWindow.webContents.openDevTools()
	cameraWindow.setMenuBarVisibility(false)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createCameraWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	cameraWindow = null
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

////////////////////////////////////////////////////
//code for AI models
////////////////////////////////////////////////////

const tf = require('@tensorflow/tfjs-node')
const fs = require('graceful-fs')

var model = null
let classNames = []

const loadModel = async () => {
	let filepath = `file://./src/AIModels/lastModel/model.json`

	try {
		model = await tf.loadLayersModel(filepath)
	} catch (err) {
		console.log(model)
	}

	let filePath = path.join(__dirname, 'AIModels', 'lastModelhistory.json')

	fs.readFile(filePath, (err, data) => {
		if (err) {
			console.log(err)
			return
		}

		const fileData = JSON.parse(data)

		fileData.adam.className.forEach(e => {
			classNames.push(e[0])
		})

		console.log(classNames)
	})
}
loadModel()

const covertResult = result => {
	if (result['handednesses'].length == 1) {
		let arr = []

		arr.push(result['handednesses'][0][0].index) // index is telling which hand side is this

		result['landmarks'][0].forEach(landmark => {
			for (const cord in landmark) {
				arr.push(landmark[cord])
			}
		})

		result['worldLandmarks'][0].forEach(worldlandmark => {
			for (const cord in worldlandmark) {
				arr.push(worldlandmark[cord])
			}
		})

		return [arr]
	} else if (result['handednesses'].length == 2) {
		let arr = []
		let arr2 = []

		arr.push(result['handednesses'][0][0].index) // index is telling which hand side is this

		result['landmarks'][0].forEach(landmark => {
			for (const cord in landmark) {
				arr.push(landmark[cord])
			}
		})

		result['worldLandmarks'][0].forEach(worldlandmark => {
			for (const cord in worldlandmark) {
				arr.push(worldlandmark[cord])
			}
		})

		arr2.push(result['handednesses'][1][0].index) // index is telling which hand side is this

		result['landmarks'][1].forEach(landmark => {
			for (const cord in landmark) {
				arr2.push(landmark[cord])
			}
		})

		result['worldLandmarks'][1].forEach(worldlandmark => {
			for (const cord in worldlandmark) {
				arr2.push(worldlandmark[cord])
			}
		})

		return [arr, arr2]
	} else {
		return []
	}
}

const predictGesture = data => {
	const result = data.results

	const detectionData = covertResult(result)

	tf.tidy(() => {
		if (detectionData.length > 0) {
			let predictions = []

			if (detectionData.length === 1) {
				let x = tf.reshape(tf.tensor1d(detectionData[0]), [-1, 127])

				let predict = model.predict(x)

				let index = predict.argMax(1).dataSync()[0]

				predictions.push(classNames[index])
			} else if (detectionData.length === 2) {
				let x1 = tf.reshape(tf.tensor1d(detectionData[0]), [-1, 127])
				let x2 = tf.reshape(tf.tensor1d(detectionData[1]), [-1, 127])

				let predict1 = model.predict(x1)

				let index1 = predict1.argMax(1).dataSync()[0]

				let predict2 = model.predict(x2)

				let index2 = predict2.argMax(1).dataSync()[0]

				predictions.push(classNames[index1])
				predictions.push(classNames[index2])
			}

			try {
				console.log(predictions[0])

				if (predictions[0] == 'stop') {
					pressS()
				} else if (predictions[0] == 'like') {
					pressA()
				} else if (predictions[0] == 'four') {
					pressD()
				} else if (predictions[0] == 'palm') {
					pressW()
				}
				cameraWindow.webContents.send('prediction:done', predictions)
			} catch (err) {
				console.log(err)
			}
		}
	})
}

ipcMain.on('predict:gesture', (event, data) => predictGesture(data))
