import SerialPort = require('serialport')
const port: SerialPort = new SerialPort('COM3')

console.log(typeof SerialPort)

console.log(typeof port)

port.write('main screen turn on', (err: any) => {
    if (err) {
        return console.log('Error on write: ', err.message)
    }
    console.log('message writt112323en')
})

// Open errors will be emitted as an error event
port.on('error', (err: any) => {
    console.log('Error: ', err.message)
})

// Switches the port into "flowing mode"
port.on('data', (data) => {
    console.log('Data2:', data.toString())
})
