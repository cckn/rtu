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

        this.serial.on('data', (data) => {
            this.hexpower.parser(data)
        })
    }

    public write(msg: number[]) {
        this.serial.write(msg, (err: any) => {
            if (err) {
                return console.log('Error on write: ', err.message)
            }
            // console.log('message written')
        })
    }
}
