import { expect } from 'chai'
import { Utils } from '../src/utils'
import { Hexpower } from '../src/hexpower'
import { Dummy } from './dummy'

describe('파서', () => {
    const dummyData = new Dummy().data
    it('태양전지 계측 정보 명령  Good', () => {
        const good: number[] = dummyData.SolarCell.good1
        const hp: Hexpower = new Hexpower(1)
        expect(hp.parser(good)).to.equal(true)
        expect(hp.parsedData.solarCell.volt).to.equal(0x123)
        expect(hp.parsedData.solarCell.current).to.equal(0x124)
    })
    it('태양전지 계측 정보 명령2 Good ', () => {
        const good: number[] = dummyData.SolarCell.good2
        const hp: Hexpower = new Hexpower(1)
        expect(hp.parser(good)).to.equal(true)
        expect(hp.parsedData.solarCell.volt).to.equal(0x123)
        expect(hp.parsedData.solarCell.current).to.equal(0x125)
    })
    it('태양전지 환경 계측 명령 Good ', () => {
        const good: number[] = dummyData.sensor.good1
        const hp: Hexpower = new Hexpower(1)
        expect(hp.parser(good)).to.equal(true)
        expect(hp.parsedData.sensor.tRadiation).to.equal(0x1123)
        expect(hp.parsedData.sensor.hRadiation).to.equal(0x1125)
        expect(hp.parsedData.sensor.outTemp).to.equal(0x1223)
        expect(hp.parsedData.sensor.moduleTemp).to.equal(0x1225)
    })
    it('태양전지 환경 계측 명령 Splited Good ', () => {
        const good: number[] = dummyData.sensor.good1
        const hp: Hexpower = new Hexpower(1)
        expect(hp.parser(good.slice(0, 10))).to.equal(false)
        expect(hp.parser(good.slice(10))).to.equal(true)
        expect(hp.parsedData.sensor.tRadiation).to.equal(0x1123)
        expect(hp.parsedData.sensor.hRadiation).to.equal(0x1125)
        expect(hp.parsedData.sensor.outTemp).to.equal(0x1223)
        expect(hp.parsedData.sensor.moduleTemp).to.equal(0x1225)
    })
})

describe('calc CRC', () => {
    it('입력된 데이터 sum 후 return 1', () => {
        const hp = new Hexpower(1)
        expect(
            hp.calcCRC(
                [
                    0x06,

                    0x30,
                    0x31,

                    0x52,

                    0x30,
                    0x30,
                    0x32,
                    0x30,

                    0x31,
                    0x32,
                    0x33,
                    0x34,
                    0x32,
                    0x33,
                    0x34,
                    0x35,
                ],
                1,
                16
            )
        ).to.equal(0x30d)
    })
    it('입력된 데이터 sum 후 return 2', () => {
        const hp = new Hexpower(1)
        expect(
            hp.calcCRC(
                [
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
                ],
                1,
                10
            )
        ).to.equal(0x1db)
    })
    it('입력된 데이터 sum 후 return 1(start end 생략)', () => {
        const hp = new Hexpower(1)
        expect(
            hp.calcCRC([
                0x06,

                0x30,
                0x31,

                0x52,

                0x30,
                0x30,
                0x32,
                0x30,

                0x31,
                0x32,
                0x33,
                0x34,
                0x32,
                0x33,
                0x34,
                0x35,
            ])
        ).to.equal(0x30d)
    })
    it('입력된 데이터 sum 후 return 2(start end 생략)', () => {
        const hp = new Hexpower(1)
        expect(
            hp.calcCRC([
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
            ])
        ).to.equal(0x1db)
    })
})

describe('패킷 검증 ', () => {
    const data = [
        0x06, // 0

        0x30, // 1
        0x31,

        0x52, // 3

        0x30, // 4
        0x30,
        0x32,
        0x30,

        0x31, // 8
        0x32,
        0x33,
        0x34,
        0x32,
        0x33,
        0x34,
        0x35,

        0x30, // 16
        0x33,
        0x30,
        0x64,

        0x04, // 20
    ]

    it('Good 패킷 검증 ', () => {
        const hp = new Hexpower(1)
        const goodpacket = data
        expect(hp.verifyResponse(data)).to.equal(true)
    })

    it('Bad 패킷 검증 (CRC BAD)', () => {
        const hp = new Hexpower(1)
        const badPacket = data.slice()
        badPacket[18] = 0x44

        expect(hp.verifyResponse(badPacket)).to.equal(false)
    })
    it('Bad 패킷 검증 (START BAD)', () => {
        const hp = new Hexpower(1)
        const badPacket = data.slice()
        badPacket[0] = 0x05

        expect(hp.verifyResponse(badPacket)).to.equal(false)
    })
    it('Bad 패킷 검증 (END BAD)', () => {
        const hp = new Hexpower(1)
        const badPacket = data.slice()
        badPacket[20] = 0x03

        expect(hp.verifyResponse(badPacket)).to.equal(false)
    })
    it.skip('Bad 패킷 검증 (length BAD)', () => {
        const hp = new Hexpower(1)
        const badPacket = data.slice()
        // badPacket[18] = 0x44

        expect(hp.verifyResponse(badPacket)).to.equal(false)
    })
})

describe('HexPower Inverter', () => {
    it('생성자 확인', () => {
        const hp1 = new Hexpower(1)
        expect(hp1.id).to.equal(1)
        const hp2 = new Hexpower(0x1f)
        expect(hp2.id).to.equal(0x1f)
    })

    it('Fault 정보 명령 request frame 생성 ', () => {
        const hp = new Hexpower(1)
        expect(hp.makeFrame(0x52, 0x04, 0x04)).to.deep.equal([
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
        const hp = new Hexpower(1)
        expect(hp.makeFrame(0x52, 0x20, 0x02)).to.deep.equal([
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
        const hp = new Hexpower(1)
        expect(hp.makeFrame(0x52, 0x50, 0x07)).to.deep.equal([
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
        const hp = new Hexpower(1)
        expect(hp.makeFrame(0x52, 0x60, 0x08)).to.deep.equal([
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
        const hp = new Hexpower(1)
        expect(hp.makeFrame(0x52, 0x1e0, 0x3)).to.deep.equal([
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
        const hp = new Hexpower(1)
        expect(hp.makeFrame(0x52, 0x70, 0x04)).to.deep.equal([
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
