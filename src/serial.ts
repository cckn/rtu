import SerialPort = require('serialport')
import { Hexpower } from './hexpower'

export class Serial {
    private serial: SerialPort
    private hexpower: Hexpower = new Hexpower(1)
    constructor(private port: string) {
        this.serial = new SerialPort(this.port)
        this.serial.on('error', (err: any) => {
            console.log('Error: ', err.message)
        })
    }

    public write(msg: number[]) {
        this.serial.write(msg, (err: any) => {
            if (err) {
                return console.log('Error on write: ', err.message)
            }
        })
    }

    public registCallback(callback: (data: number[]) => any): void {
        this.serial.on('data', (data) => {
            // console.log(data)

            callback(data)
        })
    }
}
