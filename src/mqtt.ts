import mqtt from 'mqtt'
import { Utils } from './utils'
// import os from 'os'

const client = mqtt.connect('mqtt://192.168.0.2')

client.on('connect', () => {
    setTimeout(async () => {
        const topic = `1018201609091504/1/1/14/${await new Utils().getmac()}/`

        client.subscribe(topic, (err) => {
            if (!err) {
                client.publish(topic, 'Hello mqtt')
            }
        })
    }, 1000)
})

client.on('message', (topic, message) => {
    // message is Buffer
    console.log(`topic is ${topic.toString()}`)

    console.log(message.toString())
    client.end()
})

// console.log(typeof JSON.parse(os.networkInterfaces()))

// Topic : 1018201609091504/1/1/9/1908270597/
// OID : 1018201609091504.1.1.9.1908270597
// OID : 1018201609091504.1.1.14.1908270597
