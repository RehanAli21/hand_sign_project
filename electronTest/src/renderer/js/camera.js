const { FilesetResolver, HandLandmarker } = require('@mediapipe/tasks-vision')
const { drawConnectors, drawLandmarks } = require('@mediapipe/drawing_utils')
const { HAND_CONNECTIONS } = require('@mediapipe/hands')

const { ipcRenderer } = require('electron')

const video = document.querySelector('#webcam')
const heading = document.querySelector('#heading')

let handLandmarker

const getUserMedia = async () => {
	try {
		const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })

		video.srcObject = await s
	} catch (e) {
		alert('Idiot your camera is off')
	}
}

const createGestureRecognizer = async () => {
	const vision = await FilesetResolver.forVisionTasks('./AI/vision/wasm')

	try {
		handLandmarker = await HandLandmarker.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath: './AI/handModel/hand_landmarker.task',
				delegate: 'GPU',
			},
			numHands: 2,
			runningMode: 'VIDEO',
		})
	} catch (error) {
		console.log(error)
	}

	console.log('Starting detection')
	detectVideo()
}

let lastVideoTime = -1
let results = undefined
const detectVideo = () => {
	const video = document.getElementById('webcam')
	if (video.videoWidth !== 0 && video.videoHeight !== 0) {
		const canvasElement = document.getElementById('output_canvas')
		const canvasCtx = canvasElement.getContext('2d')

		canvasElement.style.width = video.videoWidth
		canvasElement.style.height = video.videoHeight
		canvasElement.width = video.videoWidth
		canvasElement.height = video.videoHeight

		let startTimeMs = performance.now()
		if (lastVideoTime !== video.currentTime) {
			lastVideoTime = video.currentTime
			results = handLandmarker.detectForVideo(video, startTimeMs)
		}

		// console.log(results)

		ipcRenderer.send('predict:gesture', {
			results: results,
		})

		canvasCtx.save()
		canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
		if (results.landmarks) {
			for (const landmarks of results.landmarks) {
				drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
					color: '#00FF00',
					lineWidth: 5,
				})
				drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 })
			}
		}

		canvasCtx.restore()
	}
}

setInterval(detectVideo, Math.floor(1000 / 60))

ipcRenderer.on('prediction:done', (event, data) => {
	let str = 'Predictions: '

	if (data.length == 1) {
		str += data[0]
	} else if (data.length == 2) {
		str += data[0] + ' and ' + data[1]
	} else {
		str += 'null'
	}

	heading.innerHTML = str
})

getUserMedia()

createGestureRecognizer()
