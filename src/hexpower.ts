import { Utils } from './utils'

export class HexPowerInverter {
    constructor(public id: number) {}

    /**
     * makeFrame
     */
    public makeFrame(cmd: number, addr: number, size: number): Uint8Array {
        const hex2ascii = new Utils().hex2ascii
        const arr: Uint8Array = new Uint8Array(15)
        arr.set([0x05], 0)

        arr.set(hex2ascii(this.id, 2), 1) // id
        arr.set([cmd], 3) // cmd
        arr.set(hex2ascii(addr, 4), 4) // address
        arr.set(hex2ascii(size, 2), 8) // size

        let sum = 0
        for (let index = 1; index < 10; index++) {
            const element = arr[index]
            sum += element
        }
        arr.set(hex2ascii(sum, 4), 10) // CKSUM

        arr.set([0x04], 14)

        return arr
    }
}

if (require.main === module) {
    const hp = new HexPowerInverter(1)
    console.log(hp.makeFrame(0x52, 0x20, 0x02))
}
