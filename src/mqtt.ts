import mqtt from 'mqtt'

export class Mqtt {
    // private topic = `1018201609091504/1/1/14/${await new Utils().getmac()}/`
    private client: mqtt.MqttClient
    // private host: string
    constructor(private host: string, private topic: string) {
        this.client = mqtt.connect(host)

        this.client.on('connect', () => {
            this.client.subscribe(this.topic, (err: any) => {})
            console.log('MQTT Broker Connect')
        })
    }

    public pub(msg: string) {
        // this.client = mqtt.connect(this.host)

        this.client.publish(this.topic, msg)
        // this.client.end()
    }
}

// new Utils().getmac().then((mac) => {
//     const mq = new Mqtt('mqtt://192.168.0.2', `1018201609091504/1/1/14/${mac}/`)

//     setInterval(() => {
//         mq.pub('Test')
//     }, 1000)
// })
