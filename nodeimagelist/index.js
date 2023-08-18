const tf = require('@tensorflow/tfjs-node')
const wasm = require('@tensorflow/tfjs-backend-wasm')
const path = require('path')
const fs = require('graceful-fs')

///////////////////////////////////////////////////////////////////
/// Getting Data For Model Training Code Start
///////////////////////////////////////////////////////////////////
// this is for setting node max ram usage to 4096 using commandline
// set NODE_OPTIONS=--max-old-space-size=4096

let run = false

const readFile = async (path, reqData, count) => {
	await fs.readFile(path, 'utf8', async (err, data) => {
		const fileData = await JSON.parse(data)

		console.log('length of file data: ', fileData.length)

		while (fileData.length > 0) {
			await reqData.push(fileData.pop())
		}

		console.log('length of file and new Data', reqData.length)

		if (count == 3) run = true
	})
}

const data = []
let filePath = path.join(__dirname, 'imagesData', '18000', 'detectionData1.json')
readFile(filePath, data, 1)

filePath = path.join(__dirname, 'imagesData', '18000', 'detectionData2.json')
readFile(filePath, data, 2)

filePath = path.join(__dirname, 'imagesData', '18000', 'detectionData3.json')
readFile(filePath, data, 3)

/////////////////////////////////////////////////////////////////
/// Model Train Code Starts
//////////////////////////////////////////////////////////////////
const train = async (model, x, y, optimizerName, className) => {
	const history = await model.fit(x, y, {
		epochs: 400,
		shuffle: true,
		verbose: 1,
		validationSplit: 0.15,
		batchSize: 2048,
	})

	console.log('training ended: ', history)

	const name = `${optimizerName}`

	const filePath = path.join(__dirname, 'model', 'lastModelTry', `lastModelhistory18000.json`)

	const reqData = {}

	if (fs.existsSync(filePath)) {
		await fs.readFile(filePath, 'utf8', async (err, data) => {
			const fileData = await JSON.parse(data)

			for (const key in fileData) {
				reqData[key] = fileData[key]
			}

			reqData[name] = { history: history, className: className }

			console.log('new Data', reqData)

			await fs.writeFile(filePath, JSON.stringify(reqData), err => {
				console.log(err)
			})
		})
	} else {
		reqData[name] = { history: history, className: className }
		await fs.writeFile(filePath, JSON.stringify(reqData), err => {
			console.log(err)
		})
	}

	const saveResults = await model.save(`file://./model/lastModelTry/lastModel18000`, { includeOptimizer: true })

	console.log(saveResults)
}

const trainingAndChecking = async (model, tfx, tfy, className, reTrain) => {
	if (reTrain == false)
		await model.compile({
			loss: 'categoricalCrossentropy',
			metrics: ['accuracy', 'precision'],
			optimizer: tf.train.adam(0.001), //best is 0.03, 0.04 and 0.001 with adam, 0.05 with sgd
		})

	await model.summary()

	await train(model, tfx, tfy, 'adam', className)
}

///////////////////////////////////////////////////////////////
// code below is for retraining model
///////////////////////////////////////////////////////////////

// let className = null
// const readFileForRetrain = async () => {
// 	const filePath = path.join(__dirname, 'model', 'lastModelTry', 'historyadam.json')

// 	await fs.readFile(filePath, 'utf8', async (err, data) => {
// 		const fileData = await JSON.parse(data)

// 		console.log('length of className file data: ', fileData.length)

// 		className = await fileData.adam.className

// 		console.log('length of file and new Data', className.length)
// 	})
// }
// readFileForRetrain()

// // this function is for training model again
// const reTrainModel = async () => {
// 	let x = []
// 	let y = []

// 	let cni = 0

// 	console.log(className.length)

// 	const findElement = y => {
// 		for (let i = 0; i < className.length; i++) {
// 			if (className[i][0] == y) {
// 				return className[i][1]
// 			}
// 		}

// 		return []
// 	}

// 	for (let i = 0; i < data.length; i++) {
// 		const e = data[i]

// 		x.push(e.slice(0, -1))

// 		let yElement = e.at(-1)
// 		let findClass = findElement(yElement)

// 		if (findClass.length > 0) {
// 			y.push(findClass)
// 		} else {
// 			console.log('else')
// 			let arr = []

// 			for (let j = 0; j < 18; j++) {
// 				if (j == cni) arr.push(1)
// 				else arr.push(0)
// 			}

// 			className.push([yElement, arr])

// 			y.push(arr)

// 			cni++
// 		}
// 	}

// 	console.log('x: ', x.length)
// 	console.log('y: ', y.length)
// 	console.log('x: ', x[0].length)
// 	console.log('y: ', y[0].length)

// 	// Shuffling x and y
// 	for (let i = x.length - 1; i > 0; i--) {
// 		const j = Math.floor(Math.random() * (i + 1))

// 		const tempX = x[i]
// 		x[i] = x[j]
// 		x[j] = tempX

// 		const tempY = y[i]
// 		y[i] = y[j]
// 		y[j] = tempY
// 	}
// 	// Shuffling x and y
// 	for (let i = x.length - 1; i > 0; i--) {
// 		const j = Math.floor(Math.random() * (i + 1))

// 		const tempX = x[i]
// 		x[i] = x[j]
// 		x[j] = tempX

// 		const tempY = y[i]
// 		y[i] = y[j]
// 		y[j] = tempY
// 	}
// 	// Shuffling x and y
// 	for (let i = x.length - 1; i > 0; i--) {
// 		const j = Math.floor(Math.random() * (i + 1))

// 		const tempX = x[i]
// 		x[i] = x[j]
// 		x[j] = tempX

// 		const tempY = y[i]
// 		y[i] = y[j]
// 		y[j] = tempY
// 	}
// 	// Shuffling x and y
// 	for (let i = x.length - 1; i > 0; i--) {
// 		const j = Math.floor(Math.random() * (i + 1))

// 		const tempX = x[i]
// 		x[i] = x[j]
// 		x[j] = tempX

// 		const tempY = y[i]
// 		y[i] = y[j]
// 		y[j] = tempY
// 	}

// 	tf.util.shuffleCombo(x, y)

// 	const tfx = tf.tensor2d(x) // Input data (x)
// 	const tfy = tf.tensor2d(y)

// 	console.log(tfx.shape)

// 	console.log(tfy.shape)

// 	x = undefined
// 	y = undefined
// 	delete x
// 	delete y

// 	const model = await tf.loadLayersModel(`file://./model/lastModelTry/modeladam${loadModelNum}/model.json`)

// 	trainingAndChecking(model, tfx, tfy, className, false)
// }

///////////////////////////////////////////////////////////////
// code above is for retraining model
///////////////////////////////////////////////////////////////

// this function is for when model trains for the first time
function main() {
	tf.setBackend('wasm').then(async () => {
		if (run) {
			console.log('start')

			let x = []
			let y = []

			let className = []
			let cni = 0

			const findElement = y => {
				for (let i = 0; i < className.length; i++) {
					if (className[i][0] == y) {
						return className[i][1]
					}
				}

				return []
			}

			for (let i = 0; i < data.length; i++) {
				const e = data[i]

				x.push(e.slice(0, -1))

				let yElement = e.at(-1)
				let findClass = findElement(yElement)

				if (findClass.length > 0) {
					y.push(findClass)
				} else {
					let arr = []

					for (let j = 0; j < 18; j++) {
						if (j == cni) arr.push(1)
						else arr.push(0)
					}

					className.push([yElement, arr])

					y.push(arr)

					cni++
				}
			}

			console.log('x: ', x.length)
			console.log('y: ', y.length)
			console.log('x: ', x[0].length)
			console.log('y: ', y[0].length)

			// Shuffling x and y
			for (let i = x.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))

				const tempX = x[i]
				x[i] = x[j]
				x[j] = tempX

				const tempY = y[i]
				y[i] = y[j]
				y[j] = tempY
			}
			// Shuffling x and y
			for (let i = x.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))

				const tempX = x[i]
				x[i] = x[j]
				x[j] = tempX

				const tempY = y[i]
				y[i] = y[j]
				y[j] = tempY
			}
			// Shuffling x and y
			for (let i = x.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))

				const tempX = x[i]
				x[i] = x[j]
				x[j] = tempX

				const tempY = y[i]
				y[i] = y[j]
				y[j] = tempY
			}
			// Shuffling x and y
			for (let i = x.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))

				const tempX = x[i]
				x[i] = x[j]
				x[j] = tempX

				const tempY = y[i]
				y[i] = y[j]
				y[j] = tempY
			}

			tf.util.shuffleCombo(x, y)

			const tfx = tf.tensor2d(x) // Input data (x)
			const tfy = tf.tensor2d(y)

			tf.console.log(tfx.shape)

			console.log(tfy.shape)

			x = undefined
			y = undefined
			delete x
			delete y

			const model = tf.sequential()

			model.add(tf.layers.inputLayer({ inputShape: tfx.shape[1] }))
			model.add(tf.layers.batchNormalization())
			model.add(tf.layers.dense({ units: 16, activation: 'relu' }))
			model.add(tf.layers.dense({ units: 16, activation: 'relu' }))
			model.add(tf.layers.dense({ units: 32, activation: 'relu' }))
			model.add(tf.layers.dense({ units: 32, activation: 'relu' }))
			model.add(tf.layers.dense({ units: 32, activation: 'relu' }))
			model.add(tf.layers.dense({ activation: 'softmax', units: 18 }))

			trainingAndChecking(model, tfx, tfy, className, false)
		}
	})
}

setTimeout(main, 20000)
