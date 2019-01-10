import { Utils } from '../src/utils'

export class HexpowerSimulator {
    constructor(public id: number) {}

    /**
     * makeResponse
     */
    public makeResponse(address: number, datas: number[]): number[] {
        const hex2Ascii = new Utils().hex2ascii
        const response = new Uint8Array(13 + datas.length * 4)

        response[0] = 0x06
        response.set(hex2Ascii(this.id, 2), 1)
        response[3] = 0x52
        response.set(hex2Ascii(address, 4), 4)

        response[response.length - 1] = 0x04

        // console.log(response)

        return Array.from(response)
    }
}
