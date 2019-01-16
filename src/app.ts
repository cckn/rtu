import { Mqtt } from './mqtt'
import { Utils } from './utils'
import { Hexpower } from './hexpower'
import { setInterval } from 'timers'

const HOST = 'mqtt://192.168.0.2'
const INVERTER_ID = 30

const utils = new Utils()

const hp = new Hexpower(INVERTER_ID)
hp.serialInit('COM3')
utils.getmac().then((mac) => {
    const mqtt = new Mqtt(HOST, `1018201609091504/1/1/14/${mac}/`)
    setInterval(() => {
        const payload = hp.report()
        if (payload.length !== 0) {
            mqtt.pub(payload)
            console.log(payload)
        }
    }, 3000)
})
