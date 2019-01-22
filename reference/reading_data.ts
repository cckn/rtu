import SerialPort = require('serialport')
const port = new SerialPort('COM3')

// Read data that is available but keep the stream in "paused mode"
port.on('readable', () => {
    console.log('Data1:', port.read())
})

// Switches the port into "flowing mode"
port.on('data', (data) => {
    console.log('Data2:', data.toString())
})

// Pipe the data into another stream (like a parser or standard out)
// const lineStream = port.pipe(new Readline())S
