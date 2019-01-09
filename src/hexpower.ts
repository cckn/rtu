import { Utils } from './utils'
import { log } from 'util'
// import BufferList = require('bl')

interface IDataType {
    solarCell: { volt?: number; current?: number }
    utilityLine: {
        volt?: {
            rs?: number
            st?: number
            tr?: number
        }
        cuttrent?: {
            r?: number
            s?: number
            t?: number
        }
        frequency?: number
    }
    solarInverterPower: {
        solarKW?: number
        totalKWh?: number
        currentKVa?: number
        maxKW?: number
        todayKWh?: number
        invPF?: number
    }
    sensor: {
        tRadiation?: number
        hRadiation?: number
        outTemp?: number
        moduleTemp?: number
    }
}

interface IResponse {
    enq?: number
    address?: number
    cmd?: number
    start?: number
    data?: number[]
    checksum?: number
    eot?: number
}

export class HexPowerInverter {
    // private bl = new BufferList()

    public parsedData: IDataType = {
        solarCell: {},
        utilityLine: {},
        // tslint:disable-next-line:object-literal-sort-keys
        solarInverterPower: {},
        sensor: {},
    }
    private buffer = new Array()

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

    public verifyResponse(data: number[]): boolean {
        // CRC Check
        const ascii2hex = new Utils().ascii2hex
        const tmp = ascii2hex(data.slice(data.length - 5, data.length - 1))

        if (data[0] !== 0x06 || data.slice(-1)[0] !== 0x04) {
            return false
        }
        // console.log(
        //     `tmp : ${tmp}, CRC = : ${this.calcCRC(data, 1, data.length - 5)}`
        // )

        if (this.calcCRC(data, 1, data.length - 5) !== tmp) {
            return false
        }
        return true
    }

    public parser(data: number[]): boolean {
        // TODO:
        // if arr is empty

        if (data[0] === 0x06) {
            this.buffer = data
        } else if (this.buffer.length !== 0) {
            this.buffer = this.buffer.concat(data)
        }
        if (this.buffer[this.buffer.length - 1] !== 0x04) {
            return false
        }

        const ascii2hex = new Utils().ascii2hex

        if (!this.verifyResponse(this.buffer)) {
            return false
        }
        const res: IResponse = {}
        res.enq = this.buffer[0]
        res.address = ascii2hex(this.buffer.slice(1, 3))
        res.cmd = this.buffer[3]
        res.start = ascii2hex(this.buffer.slice(4, 8))
        const temp = []
        for (let index = 8; index < this.buffer.length - 5; index += 4) {
            temp.push(ascii2hex(this.buffer.slice(index, index + 4)))
        }
        res.data = temp
        res.checksum = ascii2hex(
            this.buffer.slice(this.buffer.length - 5, this.buffer.length - 1)
        )
        res.eot = this.buffer[this.buffer.length - 1]

        // console.log(res)

        switch (res.start) {
            case 0x04:
                // console.log('Fault 정보 명령')

                break
            case 0x20:
                // console.log('태양전지 계측 정보 명령')
                this.parsedData.solarCell.volt = res.data[0]
                this.parsedData.solarCell.current = res.data[1]
                break

            case 0x50:
                // console.log('계통 계측 정보 명령')
                this.parsedData.utilityLine.volt = {
                    rs: res.data[0],
                    st: res.data[1],
                    tr: res.data[2],
                }
                this.parsedData.utilityLine.cuttrent = {
                    r: res.data[3],
                    s: res.data[4],
                    t: res.data[5],
                }
                this.parsedData.utilityLine.frequency = res.data[6]
                break
            case 0x60:
                // console.log('전력량 계측 정보 명령2')
                this.parsedData.solarInverterPower.solarKW = res.data[0]
                this.parsedData.solarInverterPower.totalKWh =
                    res.data[2] * 0xffff + res.data[1]
                this.parsedData.solarInverterPower.currentKVa = res.data[3]
                this.parsedData.solarInverterPower.maxKW = res.data[4]
                this.parsedData.solarInverterPower.todayKWh = res.data[5]
                this.parsedData.solarInverterPower.invPF = res.data[6]

                break
            case 0x1e0:
                // console.log('시스템 정보 명령 ')

                break
            case 0x70:
                // console.log('태양전지 환경 계측 명령')
                this.parsedData.sensor.tRadiation = res.data[0]
                this.parsedData.sensor.hRadiation = res.data[1]
                this.parsedData.sensor.outTemp = res.data[2]
                this.parsedData.sensor.moduleTemp = res.data[3]
                break

            default:
                // console.log('알 수 없는 response')
                break
        }
        this.buffer = []

        return true
    }

    /**
     * upda:booleant
     */
    public update(): boolean {
        // 필요한 데이터들 모아오자.
        return true
    }

    public report() {
        // tslint:disable-next-line:max-line-length
        const format = `{"t":1,"d":[{"o":3316,"i":0,"e":[{"n":"5700","v":0.0},{"n":"5701","sv":"V"}]},{"o":3317,"i":0,"e":[{"n":"5700","v":0.0},{"n":"5701","sv":"A"}]},{"o":3328,"i":0,"e":[{"n":"5700","v":0},{"n":"5701","sv":"W"}]},{"o":3316,"i":1,"e":[{"n":"5700","v":0.0},{"n":"5701","sv":"V"}]},{"o":3317,"i":1,"e":[{"n":"5700","v":0.0},{"n":"5701","sv":"A"}]},{"o":3328,"i":1,"e":[{"n":"5700","v":0},{"n":"5701","sv":"W"}]},{"o":3305,"i":0,"e":[{"n":"5805","v":${'토탈'}},{"n":"5800","v":${'유효전력'}},{"n":"5810","v":-39${'무효전력'}}]},{"o":10242,"i":0,"e":[{"n":"49","v":59.96${'주파수'}},{"n":"4","v":223.6${'r volt'}},{"n":"5","v":37.1${'r current'}},{"n":"14","v":223.1${'s volt'}},{"n":"15","v":37.3${'r current'}},{"n":"24","v":224.0${'t volt'}},{"n":"25","v":37.2${'r current'}}]}]}`
    }
}

if (require.main === module) {
    const hp = new HexPowerInverter(1)
    console.log(hp.makeFrame(0x52, 0x20, 0x02))
}
