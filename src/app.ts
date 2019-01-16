import { Mqtt } from './mqtt'
import { Utils } from './utils'
import { Hexpower } from './hexpower'
import { setInterval } from 'timers'
import bigInt from 'big-integer'
import SerialPort = require('serialport')
// import { Serial } from './serial'

const HOST = 'mqtt://192.168.0.2'
const SERIAL_PORT = 'COM3'
const INVERTER_ID = [1, 2]

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
})


INVERTER_ID.forEach((id) => {
    hpList.push(new Hexpower(id))
})
export const app = () => {
    console.log(hpList)

    hpList.forEach((hp) => {
        // hp.serialInit(SERIAL_PORT)

        utils.getmac().then((mac) => {
            hp.uid = bigInt(mac)
                .multiply(0x10000)
                .plus(hp.id)
                .toString()

            setInterval(() => {
                const payload = hp.report()
                if (payload.length !== 0) {
                    mqtt.pub(payload, `1018201609091504/1/1/14/${hp.uid}/`)
                    console.log(payload)
                }
            }, 3000)
        })
    })
}

if (require.main === module) {
    app()
}
