import { Utils } from './utils'

export class HexPowerInverter {
    constructor(public id: number) {}

    public calcCRC(data: number[], startIdx?: number, endIdx?: number): number {
        const start = startIdx ? startIdx : 1
        const end = endIdx ? endIdx : data.length
        let sum = 0

        for (let index = start; index < end; index++) {
            const element = data[index]
            sum += element
        }
        return sum
    }
    /**
     * makeFrame
     */
    public makeFrame(cmd: number, addr: number, size: number): number[] {
        const hex2ascii = new Utils().hex2ascii

        let arr: number[] = new Array()
        arr = arr.concat(0x05)

        arr = arr.concat(hex2ascii(this.id, 2)) // id
        arr = arr.concat(cmd) // cmd
        arr = arr.concat(hex2ascii(addr, 4)) // address
        arr = arr.concat(hex2ascii(size, 2)) // size

        arr = arr.concat(hex2ascii(this.calcCRC(arr), 4)) // CKSUM

        arr = arr.concat(0x04)

        return arr
    }

    /**
     * verifyResponse
     */
    public verifyResponse(data: number[]): boolean {
        // CRC Check
        const ascii2hex = new Utils().ascii2hex

        const tmp = ascii2hex(data.slice(data.length - 5, data.length - 1))
        if (this.calcCRC(data, 1, data.length - 5) !== tmp) {
            return false
        }
        return true
    }

    /**
     * calcCRC
     */
}

if (require.main === module) {
    const hp = new HexPowerInverter(1)
    console.log(hp.makeFrame(0x52, 0x20, 0x02))
}
