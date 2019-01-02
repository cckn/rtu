import { expect } from 'chai'
import { Utils } from '../src/utils'

describe('Hex to Ascii', () => {
    it('value가 정확히 변경되는지 확인', () => {
        const utils = new Utils()
        expect(utils.hex2ascii(0x01, 1)).deep.equal([0x31])
        expect(utils.hex2ascii(0x09, 1)).deep.equal([0x39])
        expect(utils.hex2ascii(0x0f, 1)).deep.equal([0x66])
    })

    it('value가 정확히 변경되는지 확인', () => {
        const utils = new Utils()
        expect(utils.hex2ascii(0x01, 1)).deep.equal([0x31])
        expect(utils.hex2ascii(0x09, 1)).deep.equal([0x39])
        expect(utils.hex2ascii(0x0f, 1)).deep.equal([0x66])
    })
})
