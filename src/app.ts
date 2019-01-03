import { Serial } from './serial'
import { HexPowerInverter } from './hexpower'

const hp = new HexPowerInverter(1)
const serial = new Serial('COM3')

serial.write(hp.makeFrame(0x52, 0x20, 2))
