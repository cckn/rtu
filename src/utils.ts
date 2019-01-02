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
        str = Array(size - str.length + 1).join('0') + str
        for (let i = 0, l = str.length; i < l; i++) {
            const hex = Number(str.charCodeAt(i)) // .toString(16)
            arr.push(hex)
        }
        return arr // .join('')
    }

    public ascii2hex() {}
}

if (require.main === module) {
    const utils = new Utils()
    console.log(utils.hex2ascii(0x01, 2))
}
