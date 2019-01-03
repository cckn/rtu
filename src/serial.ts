import SerialPort = require('serialport')
import { HexPowerInverter } from './hexpower'
import BufferList = require('bl')

const bl = new BufferList()

export class Serial {
    private serial: SerialPort
    constructor(private port: string) {
        this.serial = new SerialPort(this.port)
        this.serial.on('error', (err: any) => {
            console.log('Error: ', err.message)
        })

        this.serial.on('data', (data) => {
            bl.append(data)
            if (bl.length < 15) {
                return
            }

            // console.log(bl.slice(0, 15)[12])
            console.log(bl.slice(0, 15))
            bl.destroy()

            // console.log(data)
        })
    }

    public write(msg: number[]) {
        this.serial.write(msg, (err: any) => {
            if (err) {
                return console.log('Error on write: ', err.message)
            }
            console.log('message written')
        })
    }
}
