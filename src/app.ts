import { Mqtt } from './mqtt'
import { Utils } from './utils'
import { Hexpower } from './hexpower'
import { setInterval } from 'timers'
import bigInt from 'big-integer'
import SerialPort = require('serialport')
// import { Serial } from './serial'

const HOST = 'mqtt://110.10.129.92'
const SERIAL_PORT = '/dev/serial0'
const INVERTER_ID = [1, 2, 3, 4, 5]

const utils = new Utils()
const mqtt = new Mqtt(HOST)
const serial: SerialPort = new SerialPort(SERIAL_PORT)
let buffer: number[] = []
const hpList: Hexpower[] = []

serial.on('error', (err: any) => {
    console.log('Error: ', err.message)
})

serial.on('data', (data) => {
    data = Array.from(data)

    if (data[0] === 0x06) {
        buffer = data
    } else if (buffer.length !== 0) {
        buffer = buffer.concat(data)
    }
    if (buffer[buffer.length - 1] !== 0x04) {
        return false
    }
    console.log(utils.ascii2hex(buffer.slice(1, 3)))
    hpList.forEach((hp) => {
        if (hp.id === utils.ascii2hex(buffer.slice(1, 3))) {
            hp.parser(buffer)
            // buffer = []
            return
        }
    })
})

export const app = async (mac: number) => {
    const reqFrameArray: number[][] = []

    INVERTER_ID.forEach((id) => {
        const hp = new Hexpower(id)
        hp.reqFrameArray.forEach((reqFrame) => {
            reqFrameArray.push(reqFrame)
        })
        hpList.push(hp)
    })

    let count = 0

    await hpList.forEach((hp: Hexpower) => {
        // hp.serialInit(SERIAL_PORT)
        const macAndId: string = bigInt(mac)
            .multiply(0x10000)
            .plus(hp.id)
            .toString()
        hp.topic = `1018201609091504/1/1/14/${macAndId}/`
        hp.oid = `1018201609091504.1.1.14.${macAndId}`

        setInterval(() => {
            const payload = hp.report()
            // console.log(hpList)

            if (payload.length !== 0) {
                mqtt.pub(payload, hp.topic)
                console.log(`report : ${hp.id}`)

                // toggle
            }
        }, 10000)
    })
    setInterval(() => {
        if (serial) {
            serial.write(reqFrameArray[count % reqFrameArray.length])
        }
        count++
    }, 1000)
    console.log(mac)

    console.log(hpList)
}

if (require.main === module) {
    // utils.getmac().then((mac: number) => app(mac))
    const mac = 2483143332358
    app(mac)
}
