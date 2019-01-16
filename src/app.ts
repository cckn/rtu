import { Mqtt } from './mqtt'
import { Utils } from './utils'
import { Hexpower } from './hexpower'
import { setInterval } from 'timers'
import bigInt from 'big-integer'

const HOST = 'mqtt://192.168.0.2'
const SEREAL_PORT = 'COM3'
const INVERTER_ID = 31

const utils = new Utils()

const hp = new Hexpower(INVERTER_ID)
hp.serialInit(SEREAL_PORT)

utils.getmac().then((mac) => {
    const id = INVERTER_ID.toString(16)
    const uid = bigInt(mac)
        .multiply(0x10000)
        .plus(INVERTER_ID)
        .toString() // + '0'.repeat(4 - id.length) + id
    // console.log(uid)

    hp.uid = uid
    const mqtt = new Mqtt(HOST)
    setInterval(() => {
        const payload = hp.report()
        if (payload.length !== 0) {
            mqtt.pub(payload, `1018201609091504/1/1/14/${hp.uid}/`)
            console.log(payload)
        }
    }, 3000)
})
