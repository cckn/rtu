export class Utils {
    constructor() {}

    /**
     * hex2ascii
     */
    public hex2ascii(value: number, size: number): number[] {
        const arr = []
        const str = value.toString(16)
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
    console.log(utils.hex2ascii(0x0f, 1))
}
