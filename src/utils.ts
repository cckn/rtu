export class Utils {
    constructor() {}

    /**
     * hex2ascii
     */
    public hex2ascii(value: number, size: number): number[] {
        const arr = []
        let str = value.toString(16)
        if (str.length > size) {
            throw new Error('ddd')
        }
        str = '0'.repeat(size - str.length) + str
        for (let i = 0, l = str.length; i < l; i++) {
            const hex = Number(str.charCodeAt(i)) // .toString(16)
            arr.push(hex)
        }
        return arr // .join('')
    }

    /**
     * ascii2hex
     */
    public ascii2hex(arr: number[]): number {
        const hex = Array.from(arr, (byte) => {
            return ('0' + (byte & 0xff).toString(16)).slice(-2)
        }).join('')

        let str = ''
        for (let i = 0; i < hex.length && hex.substr(i, 2) !== '00'; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
        }

        const ret = parseInt(str, 16)
        if (!ret) {
            throw new Error('Invalid Value')
        }
        return ret
    }
}

if (require.main === module) {
    const utils = new Utils()
    console.log(utils.ascii2hex([0x66]))
}
