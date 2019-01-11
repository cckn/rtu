import { Utils } from '../src/utils'
import { Serial } from '../src/serial'

export class HexpowerSimulator {
    private buffer: number[] = []
    private serial = new Serial('COM12')

    constructor() {
        this.serial.registCallback(this.parse)
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
        // console.log(data)
        data = Array.from(data)

        if (data[0] === 0x05) {
            this.buffer = data
        } else if (this.buffer.length !== 0) {
            this.buffer = this.buffer.concat(data)
        }

        if (this.buffer[this.buffer.length - 1] !== 0x04) {
            return false
        }

        this.serial.write(this.parse(this.buffer))

        this.buffer = []
        return true
    }
}

if (require.main === module) {
    const hp = new HexpowerSimulator()

    // console.log(hp.report())
}
