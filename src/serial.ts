import SerialPort = require('serialport')
import { HexPowerInverter } from './hexpower'

const hp = new HexPowerInverter(1)
console.log(hp.makeFrame(0x52, 0x20, 0x02))

const port = new SerialPort('COM3')

port.write(hp.makeFrame(0x52, 0x20, 0x02), (err: any) => {
    if (err) {
        return console.log('Error on write: ', err.message)
    }
    console.log('message written')
})

// Open errors will be emitted as an error event
port.on('error', (err: any) => {
    console.log('Error: ', err.message)
})
