import { Utils } from './utils'

export class HexPowerInverter {
    constructor(public id: number) {}

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

        let sum = 0
        for (let index = 1; index < 10; index++) {
            const element = arr[index]
            sum += element
        }
        arr = arr.concat(hex2ascii(sum, 4)) // CKSUM

        arr = arr.concat(0x04)

        return arr
    }
}

if (require.main === module) {
    const hp = new HexPowerInverter(1)
    console.log(hp.makeFrame(0x52, 0x20, 0x02))
}
