import { Mqtt } from './mqtt'
import { Utils } from './utils'
import { Serial } from './serial'
import { Hexpower } from './hexpower'
import { setInterval } from 'timers'

const HOST = 'mqtt://192.168.0.2'
const INVERTER_ID = 1

const utils = new Utils()

const hp = new Hexpower(INVERTER_ID)

utils.getmac().then((mac) => {
    const mqtt = new Mqtt(HOST, `1018201609091504/1/1/14/${mac}/`)
    setInterval(() => {
        const payload = hp.report()
        if (payload.length !== 0) {
            mqtt.pub(payload)
        }
    }, 30000)
})

const reqFrameArray = [
    hp.makeFrame(0x52, 0x50, 0x07),
    hp.makeFrame(0x52, 0x60, 0x08),
]
let count = 0
setInterval(() => {
    serial.write(reqFrameArray[count % reqFrameArray.length])
    count++
}, 10000)
console.log(reqFrameArray)

const serial = new Serial('COM3')
serial.registCallback(hp.parser)
