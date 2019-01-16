import { Utils } from '../src/utils'
// import { Serial } from '../src/serial'
import SerialPort = require('serialport')

// let buffer: number[] = []
export class HexpowerSimulator {
    private serial?: SerialPort
    private buf: number[] = []
    // private serial = new Serial('COM12')

    constructor() {
        // this.serial.registCallback(this.serialCallback)
        // console.log(this.buf)
    }
    /**
     * serialInit
     */
    public serialInit(port: string) {
        this.serial = new SerialPort(port)
        this.serial.on('error', (err: any) => {
            console.log('Error: ', err.message)
        })
        this.serial.on('data', (data) => {
            this.serialCallback(data)
        })
    }

    /**
     * makeResponse
     */
    public makeResponse(id: number, address: number, size: number): number[] {
        const utils: Utils = new Utils()
        const response: Uint8Array = new Uint8Array(13 + size * 4)

        response[0] = 0x06
        response.set(utils.hex2ascii(id, 2), 1)
        response[3] = 0x52
        response.set(utils.hex2ascii(address, 4), 4)

        for (let index = 0; index < size; index++) {
            const element = id + index
            response.set(utils.hex2ascii(element, 4), 8 + index * 4)
        }

        const checksum = utils.sum(
            Array.from(response).slice(1, response.length - 5)
        )
        response.set(utils.hex2ascii(checksum, 4), response.length - 5)

        response[response.length - 1] = 0x04

        return Array.from(response)
    }

    public parse(data: number[]): number[] {
        const ascii2hex: (arr: number[]) => number = new Utils().ascii2hex

        const id = ascii2hex(data.slice(1, 3))
        const address = ascii2hex(data.slice(4, 8))
        const size = ascii2hex(data.slice(8, 10))
        return this.makeResponse(id, address, size)
    }

    /**
     * serialCallback
     */
    public serialCallback(data: number[]): boolean {
        if (this.serial) {
            data = Array.from(data)
            // console.log(data)
            console.log(`buffer : ${this.buf}, data : ${data}`)

            if (data[0] === 0x05) {
                // console.log(`buffer : ${buffer}, data : ${data}`)

                this.buf = data
            } else if (this.buf.length !== 0) {
                this.buf = this.buf.concat(data)
            }

            if (this.buf[this.buf.length - 1] !== 0x04) {
                return false
            }

            this.serial.write(this.parse(this.buf), (err: any) => {
                if (err) {
                    return console.log('Error on write: ', err.message)
                }
            })

            this.buf = []
            return true
        }
        return false
    }
}

if (require.main === module) {
    const hp = new HexpowerSimulator()
    hp.serialInit('COM12')

    // console.log(hp.report())
}
