import { HexpowerSimulator } from '../src/hexpowerSimulator'
import { Hexpower } from '../src/hexpower'
import { expect } from 'chai'
import { Utils } from '../src/utils'

describe('HexpowerSimulator', () => {
    const simulator = new HexpowerSimulator()
    const ascii2Hex = new Utils().ascii2hex

    describe('make response', () => {
        const data1 = [1, 2, 3, 4, 5, 6, 7]
        const data2 = [1, 2, 3, 4, 5, 6, 7, 8]

        const id1_data1 = simulator.makeResponse(1, 0x50, 7)
        const id1_data2 = simulator.makeResponse(1, 0x60, 8)

        const id100_data1 = simulator.makeResponse(100, 0x50, 7)
        const id100_data2 = simulator.makeResponse(100, 0x60, 8)

        it('계통 계측 정보 응답 길이', () => {
            expect(id1_data1.length).to.equal(13 + 7 * 4)
        })
        it('전력량 계측 정보 명령 2 응답 길이 ', () => {
            expect(id1_data2.length).to.equal(13 + 8 * 4)
        })
        it('ACK, EOT vertify', () => {
            expect(id1_data1[0]).to.equal(6)
            expect(id1_data1[id1_data1.length - 1]).to.equal(4)
            expect(id1_data2[0]).to.equal(6)
            expect(id1_data2[id1_data2.length - 1]).to.equal(4)

            expect(id100_data1[0]).to.equal(6)
            expect(id100_data1[id100_data1.length - 1]).to.equal(4)
            expect(id100_data2[0]).to.equal(6)
            expect(id100_data2[id100_data2.length - 1]).to.equal(4)
        })
        it('id vertify', () => {
            expect(ascii2Hex(id1_data1.slice(1, 3))).to.equal(1)
            expect(ascii2Hex(id1_data2.slice(1, 3))).to.equal(1)

            expect(ascii2Hex(id100_data1.slice(1, 3))).to.equal(100)
            expect(ascii2Hex(id100_data2.slice(1, 3))).to.equal(100)
        })
        it('cmd vertify', () => {
            expect(id1_data1[3]).to.equal(0x52)
        })
        it('address vertify', () => {
            expect(ascii2Hex(id1_data1.slice(4, 8))).to.equal(0x50)
            expect(ascii2Hex(id1_data2.slice(4, 8))).to.equal(0x60)
        })
        it('data check ', () => {
            expect(ascii2Hex(id1_data1.slice(8, 12))).to.equal(1)
            expect(ascii2Hex(id1_data1.slice(12, 16))).to.equal(2)

            expect(ascii2Hex(id100_data1.slice(8, 12))).to.equal(100)
            expect(ascii2Hex(id100_data1.slice(12, 16))).to.equal(101)
        })
        it('CheckSum check ', () => {
            expect(
                ascii2Hex(
                    id1_data1.slice(id1_data1.length - 5, id1_data1.length - 1)
                )
            ).to.equal(
                new Utils().sum(id1_data1.slice(1, id1_data1.length - 5))
            )
        })
    })

    describe('parse', () => {
        const hp1 = new Hexpower(1)
        const hp100 = new Hexpower(100)
        const requestFrame: number[][] = [
            hp1.makeFrame(0x52, 0x50, 7),
            hp1.makeFrame(0x52, 0x60, 8),
            hp100.makeFrame(0x52, 0x50, 7),
            hp100.makeFrame(0x52, 0x60, 8),
        ]
        const responseFrame: number[][] = [
            simulator.makeResponse(1, 0x50, 7),
            simulator.makeResponse(1, 0x60, 8),
            simulator.makeResponse(100, 0x50, 7),
            simulator.makeResponse(100, 0x60, 8),
        ]
        // console.log(requestFrame)
        it('parse', () => {
            for (let index = 0; index < requestFrame.length; index++) {
                expect(simulator.parse(requestFrame[index])).to.deep.equal(
                    responseFrame[index]
                )
            }
        })
        it.skip('callback fucntion', () => {
            for (let index = 0; index < requestFrame.length; index++) {
                expect(
                    simulator.serialCallback(requestFrame[index])
                ).to.deep.equal(true)
            }
        })
        it.skip('splited data callback fucntion', () => {
            for (let index = 0; index < requestFrame.length; index++) {
                expect(
                    simulator.serialCallback(requestFrame[index].slice(0, 5))
                ).to.deep.equal(false)
                expect(
                    simulator.serialCallback(requestFrame[index].slice(5))
                ).to.deep.equal(true)
            }
        })
    })
})
