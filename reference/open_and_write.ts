import SerialPort = require('serialport')
const port = new SerialPort('COM3')

port.write('main screen turn on', (err: any) => {
    if (err) {
        return console.log('Error on write: ', err.message)
    }
    console.log('message written')
})

// Open errors will be emitted as an error event
port.on('error', (err: any) => {
    console.log('Error: ', err.message)
})
