import { Utils } from '../src/utils'

export class HexpowerSimulator {
    constructor() {}

    /**
     * makeResponse
     */
    public makeResponse(
        id: number,
        address: number,
        datas: number[]
    ): number[] {
        const utils = new Utils()
        const response = new Uint8Array(13 + datas.length * 4)

        response[0] = 0x06
        response.set(utils.hex2ascii(id, 2), 1)
        response[3] = 0x52
        response.set(utils.hex2ascii(address, 4), 4)

        for (let index = 0; index < datas.length; index++) {
            const element = datas[index]
            response.set(utils.hex2ascii(element, 4), 8 + index * 4)
        }

        const checksum = utils.sum(
            Array.from(response).slice(1, response.length - 5)
        )
        response.set(utils.hex2ascii(checksum, 4), response.length - 5)

        response[response.length - 1] = 0x04

        return Array.from(response)
    }
}
