import mqtt from 'mqtt'
import { Utils } from './utils'

export class Mqtt {
    // private topic = `1018201609091504/1/1/14/${await new Utils().getmac()}/`
    private client: mqtt.MqttClient
    constructor(private host: string, private topic: string) {
        this.client = mqtt.connect(host)

        this.client.on('connect', () => {
            this.client.subscribe(this.topic, (err: any) => {
                // if (!err) {
                //     this.client.publish(this.topic, 'Hello mqtt')
                // }
            })
            console.log('MQTT Broker Connect')
        })

        // this.client.on('message', (t: string, message: string) => {
        //     // message is Buffer
        //     console.log(`topic is ${t.toString()}`)

        //     console.log(message.toString())
        //     this.client.end()
        // })
    }
    /**
     * send
     */
    public pub(msg: string) {
        this.client.publish(this.topic, msg)
    }
}

new Utils().getmac().then((mac) => {
    const mq = new Mqtt('mqtt://192.168.0.2', `1018201609091504/1/1/14/${mac}/`)

    setInterval(() => {
        mq.pub('Test')
    }, 1000)
})
