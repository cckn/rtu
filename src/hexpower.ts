import { Utils } from './utils'
import { log } from 'util'
// import BufferList = require('bl')

interface IDataType {
    solarCell: { volt?: number; current?: number }
    utilityLine: {
        rsVolt?: number
        stVolt?: number
        trVolt?: number
        rCurrent?: number
        sCurrent?: number
        tCurrent?: number
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

interface IReportData {
    total?: number | undefined
    activePower?: number | undefined
    reactivePower?: number | undefined
    frquency?: number | undefined
    rsVolt?: number | undefined
    stVolt?: number | undefined
    trVolt?: number | undefined
    rCurrent?: number | undefined
    sCurrent?: number | undefined
    tCurrent?: number | undefined
}

export let parsedData: IDataType = {
    solarCell: {},
    utilityLine: {},
    // tslint:disable-next-line:object-literal-sort-keys
    solarInverterPower: {},
    sensor: {},
}
let reportData: IReportData = {}

export class Hexpower {
    // private bl = new BufferList()
    public res: IResponse = {}

    // public parsedData: IDataType = {
    //     solarCell: {},
    //     utilityLine: { frequency: 0 },
    //     // tslint:disable-next-line:object-literal-sort-keys
    //     solarInverterPower: {},
    //     sensor: {},
    // }
    private buffer = new Array()

    constructor(private id: number) {}

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
        // `tmp : ${tmp}, CRC = : ${this.calcCRC(data, 1, data.length - 5)}`
        // )

        if (this.calcCRC(data, 1, data.length - 5) !== tmp) {
            return false
        }
        return true
    }

    public parser(data: number[]): boolean {
        // console.log(data)
        data = Array.from(data)

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
        this.res.enq = this.buffer[0]
        this.res.address = ascii2hex(this.buffer.slice(1, 3))
        this.res.cmd = this.buffer[3]
        this.res.start = ascii2hex(this.buffer.slice(4, 8))
        const temp = []
        for (let index = 8; index < this.buffer.length - 5; index += 4) {
            temp.push(ascii2hex(this.buffer.slice(index, index + 4)))
        }
        this.res.data = temp
        this.res.checksum = ascii2hex(
            this.buffer.slice(this.buffer.length - 5, this.buffer.length - 1)
        )
        this.res.eot = this.buffer[this.buffer.length - 1]

        // console.log(this.res)

        switch (this.res.start) {
            case 0x04:
                // console.log('Fault 정보 명령')

                break
            case 0x20:
                // console.log('태양전지 계측 정보 명령')
                parsedData.solarCell.volt = this.res.data[0]
                parsedData.solarCell.current = this.res.data[1]
                break

            case 0x50:
                // console.log('계통 계측 정보 명령')
                parsedData.utilityLine.rsVolt = this.res.data[0]
                parsedData.utilityLine.stVolt = this.res.data[1]
                parsedData.utilityLine.trVolt = this.res.data[2]
                parsedData.utilityLine.rCurrent = this.res.data[3]
                parsedData.utilityLine.sCurrent = this.res.data[4]
                parsedData.utilityLine.tCurrent = this.res.data[5]
                parsedData.utilityLine.frequency = this.res.data[6]
                // console.log(parsedData)

                break
            case 0x60:
                // console.log('전력량 계측 정보 명령2')
                parsedData.solarInverterPower.solarKW = this.res.data[0]
                parsedData.solarInverterPower.totalKWh =
                    this.res.data[2] * 0xffff + this.res.data[1]
                parsedData.solarInverterPower.currentKVa = this.res.data[3]
                parsedData.solarInverterPower.maxKW = this.res.data[4]
                parsedData.solarInverterPower.todayKWh = this.res.data[5]
                parsedData.solarInverterPower.invPF = this.res.data[7]

                break
            case 0x1e0:
                // console.log('시스템 정보 명령 ')

                break
            case 0x70:
                // console.log('태양전지 환경 계측 명령')
                parsedData.sensor.tRadiation = this.res.data[0]
                parsedData.sensor.hRadiation = this.res.data[1]
                parsedData.sensor.outTemp = this.res.data[2]
                parsedData.sensor.moduleTemp = this.res.data[3]
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

    public report(): string {
        if (this.update()) {
            // tslint:disable-next-line:max-line-length
            const format =
                `{"t":1,"d":[{"o":3316,"i":0,"e":[{"n":"5700","v":0.0},{"n":"5701","sv":"V"}]},{"o":3317,"i":0,"e":[{"n":"5700","v":0.0},{"n":"5701","sv":"A"}]},{"o":3328,"i":0,"e":[{"n":"5700","v":0},{"n":"5701","sv":"W"}]},{"o":3316,"i":1,"e":[{"n":"5700","v":0.0},{"n":"5701","sv":"V"}]},{"o":3317,"i":1,"e":[{"n":"5700","v":0.0},{"n":"5701","sv":"A"}]},{"o":3328,"i":1,"e":[{"n":"5700","v":0},{"n":"5701","sv":"W"}]},{"o":3305,"i":0,"e":` +
                `[{"n":"5805","v":${reportData.total}},` +
                `{"n":"5800","v":${reportData.activePower}},` +
                `{"n":"5810","v":${reportData.reactivePower}}]},` +
                `{"o":10242,"i":0,"e":[
            ` +
                `{"n":"49","v":${reportData.frquency}},` +
                `{"n":"4","v":${reportData.rsVolt}},` +
                `{"n":"5","v":${reportData.rCurrent}},` +
                `{"n":"14","v":${reportData.stVolt}},` +
                `{"n":"15","v":${reportData.sCurrent}},` +
                `{"n":"24","v":${reportData.trVolt}},` +
                `{"n":"25","v":${reportData.tCurrent}}]}]}`
            parsedData = {
                solarCell: {},
                utilityLine: {},
                // tslint:disable-next-line:object-literal-sort-keys
                solarInverterPower: {},
                sensor: {},
            }
            reportData = {}

            return format
        }
        return ''
    }
    private update(): boolean {
        // 필요한 데이터들 모아오자.

        if (
            parsedData.solarInverterPower.totalKWh &&
            parsedData.solarInverterPower.currentKVa &&
            parsedData.solarInverterPower.invPF &&
            parsedData.solarInverterPower.currentKVa &&
            parsedData.utilityLine.frequency &&
            parsedData.utilityLine.rsVolt &&
            parsedData.utilityLine.rCurrent
        ) {
            reportData.total = parsedData.solarInverterPower.totalKWh
            reportData.activePower = parsedData.solarInverterPower.currentKVa

            reportData.reactivePower =
                ((100 - parsedData.solarInverterPower.invPF) / 100) *
                parsedData.solarInverterPower.currentKVa *
                -1

            reportData.frquency = parsedData.utilityLine.frequency
            reportData.rsVolt = parsedData.utilityLine.rsVolt
            reportData.stVolt = parsedData.utilityLine.stVolt
            reportData.trVolt = parsedData.utilityLine.trVolt
            reportData.rCurrent = parsedData.utilityLine.rCurrent
            reportData.sCurrent = parsedData.utilityLine.sCurrent
            reportData.tCurrent = parsedData.utilityLine.tCurrent

            // console.log(reportData)
            // console.log(parsedData)
            return true
        }
        return false
    }
}

if (require.main === module) {
    const hp = new Hexpower(1)
    // console.log(hp.report())
}
