import { expect } from 'chai'
import { Utils } from '../src/utils'
import { HexPowerInverter } from '../src/hexpower'

describe('HexPower Inverter', () => {
    it('생성자 확인', () => {
        const hexpower1 = new HexPowerInverter(1)
        expect(hexpower1.id).to.equal(1)
        const hexpower2 = new HexPowerInverter(0x1f)
        expect(hexpower2.id).to.equal(0x1f)
    })

    it('Fault 정보 명령 request frame 생성 ', () => {
        const hexpower = new HexPowerInverter(1)
        expect(hexpower.makeFrame(0x52, 0x04, 0x04)).to.deep.equal([
            0x05, // 0 ENQ

            0x30, // 1 ID
            0x31,

            0x52, // 3 CMD

            0x30, // 4 ADDR
            0x30,
            0x30,
            0x34,

            0x30, // 8 SIZE
            0x34,

            0x30, // 10 CKSUM
            0x31,
            0x64,
            0x62,

            0x04, // 14 EOT
        ])
    })

    it('태양전지 계층 정보 명령 request frame 생성 ', () => {
        const hexpower = new HexPowerInverter(1)
        expect(hexpower.makeFrame(0x52, 0x20, 0x02)).to.deep.equal([
            0x05, // 0 ENQ

            0x30, // 1 ID
            0x31,

            0x52, // 3 CMD

            0x30, // 4 ADDR
            0x30,
            0x32,
            0x30,

            0x30, // 8 SIZE
            0x32,

            0x30, // 10 CKSUM
            0x31,
            0x64,
            0x37,

            0x04, // 14 EOT
        ])
    })

    it('계통 계측 정보 명령 request frame 생성 ', () => {
        const hexpower = new HexPowerInverter(1)
        expect(hexpower.makeFrame(0x52, 0x50, 0x07)).to.deep.equal([
            0x05,

            0x30,
            0x31,

            0x52,

            0x30,
            0x30,
            0x35,
            0x30,

            0x30,
            0x37,

            0x30,
            0x31,
            0x64,
            0x66,

            0x04,
        ])
    })

    it('전력량 계측 정보 명령2 request frame 생성 ', () => {
        const hexpower = new HexPowerInverter(1)
        expect(hexpower.makeFrame(0x52, 0x60, 0x08)).to.deep.equal([
            0x05, // 0 ENQ

            0x30, // 1 ID
            0x31,

            0x52, // 3 CMD

            0x30, // 4 ADDR
            0x30,
            0x36,
            0x30,

            0x30, // 8 SIZE
            0x38,

            0x30, // 10 CKSUM
            0x31,
            0x65,
            0x31,

            0x04, // 14 EOT
        ])
    })

    it('시스템 정보 명령 request frame 생성 ', () => {
        const hexpower = new HexPowerInverter(1)
        expect(hexpower.makeFrame(0x52, 0x1e0, 0x3)).to.deep.equal([
            0x05, // 0 ENQ

            0x30, // 1 ID
            0x31,

            0x52, // 3 CMD

            0x30, // 4 ADDR
            0x31,
            0x65,
            0x30,

            0x30, // 8 SIZE
            0x33,

            0x30, // 10 CKSUM
            0x32,
            0x30,
            0x63,

            0x04, // 14 EOT
        ])
    })

    it('태양전지 환경 계측 명령 request frame 생성 ', () => {
        const hexpower = new HexPowerInverter(1)
        expect(hexpower.makeFrame(0x52, 0x70, 0x04)).to.deep.equal([
            0x05, // 0 ENQ

            0x30, // 1 ID
            0x31,

            0x52, // 3 CMD

            0x30, // 4 ADDR
            0x30,
            0x37,
            0x30,

            0x30, // 8 SIZE
            0x34,

            0x30, // 10 CKSUM
            0x31,
            0x64,
            0x65,

            0x04, // 14 EOT
        ])
    })
})
