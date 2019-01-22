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

        // console.log(str)

        const ret = parseInt(str, 16)
        if (isNaN(ret)) {
            throw new Error('Invalid Value')
        }
        return ret
    }

    public sum(arr: number[]): number {
        let sum = 0
        arr.forEach((element) => {
            sum += element
        })
        return sum
    }

    public getmac(): Promise<number> {
        return new Promise((resolve, reject) => {
            require('getmac').getMac((err: any, macAddress: any) => {
                if (err) {
                    reject(err)
                }
                console.log(macAddress)

                resolve(parseInt(macAddress.replace(/:/g, ''), 16))
            })
        })
    }
}

if (require.main === module) {
    const utils = new Utils()

    utils.getmac().then((mac) => {
        console.log(mac)
    })
}
