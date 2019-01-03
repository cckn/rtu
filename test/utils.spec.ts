import { expect } from 'chai'
import { Utils } from '../src/utils'

describe.skip('Hex to Ascii', () => {
    it('value가 정확히 변경되는지 확인', () => {
        const utils = new Utils()
        expect(utils.hex2ascii(0x01, 1)).deep.equal([0x31])
        expect(utils.hex2ascii(0x09, 1)).deep.equal([0x39])
        expect(utils.hex2ascii(0x0f, 1)).deep.equal([0x66])
    })

    it('자릿수 변경 시? ', () => {
        const utils = new Utils()
        expect(utils.hex2ascii(0x01, 2)).deep.equal([0x30, 0x31])
        expect(utils.hex2ascii(0x01, 4)).deep.equal([0x30, 0x30, 0x30, 0x31])
        expect(utils.hex2ascii(0xff, 4)).deep.equal([0x30, 0x30, 0x66, 0x66])
        expect(utils.hex2ascii(0xffff, 4)).deep.equal([0x66, 0x66, 0x66, 0x66])
    })

    it('사이즈보다 큰 값이 들어간 경우 Error를 발생시킨다.', () => {
        const utils = new Utils()
        expect(() => utils.hex2ascii(0xff, 2)).to.not.throw()
        expect(() => utils.hex2ascii(0xff, 1)).to.throw()
    })
})

describe.skip('Ascii to Hex', () => {
    it('value가 정확히 변경되는지 확인', () => {
        const utils = new Utils()
        expect(utils.ascii2hex([0x31])).equal(0x01)
        expect(utils.ascii2hex([0x66])).equal(0x0f)
        expect(utils.ascii2hex([0x66, 0x66, 0x66, 0x66])).equal(0xffff)
    })

    it('데이터가 틀리면 에러 발생 ', () => {
        const utils = new Utils()
        expect(() => utils.ascii2hex([0x29])).to.throw()
        expect(() => utils.ascii2hex([0x30])).to.not.throw()
    })
})
