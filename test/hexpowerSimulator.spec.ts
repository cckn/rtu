import { HexpowerSimulator } from '../src/hexpowerSimulator'
import { expect } from 'chai'
import { Utils } from '../src/utils'

describe('시뮬레이터 생성 ', () => {
    it('1', () => {
        const simulator = new HexpowerSimulator(1)
        expect(simulator.id).to.equal(1)
    })
    it('255', () => {
        const simulator = new HexpowerSimulator(255)
        expect(simulator.id).to.equal(255)
    })
})
describe.only('make response', () => {
    it('계통 계측 정보 응답 길이', () => {
        const simulator = new HexpowerSimulator(1)
        expect(simulator.makeResponse(0x50, 7).length).to.equal(13 + 7 * 4)
    })
    it('전력량 계측 정보 명령 2 응답 길이 ', () => {
        const simulator = new HexpowerSimulator(255)
        expect(simulator.makeResponse(0x60, 8).length).to.equal(13 + 8 * 4)
    })
    it('ACK, EOT vertify', () => {
        const simulator = new HexpowerSimulator(1)
        const test1 = simulator.makeResponse(0x50, 7)
        const test2 = simulator.makeResponse(0x60, 8)
        expect(test1[0]).to.equal(6)
        expect(test1[test1.length - 1]).to.equal(4)
        expect(test2[0]).to.equal(6)
        expect(test2[test2.length - 1]).to.equal(4)
    })
    it('id vertify', () => {
        const ascii2Hex = new Utils().ascii2hex
        const simulator1 = new HexpowerSimulator(1)
        const test1_1 = simulator1.makeResponse(0x50, 7)
        const test1_2 = simulator1.makeResponse(0x60, 8)
        expect(ascii2Hex(test1_1.slice(1, 3))).to.equal(1)
        expect(ascii2Hex(test1_2.slice(1, 3))).to.equal(1)

        const simulator2 = new HexpowerSimulator(100)
        const test2_1 = simulator2.makeResponse(0x50, 7)
        const test2_2 = simulator2.makeResponse(0x60, 8)
        expect(ascii2Hex(test2_1.slice(1, 3))).to.equal(100)
        expect(ascii2Hex(test2_2.slice(1, 3))).to.equal(100)
    })
    it('cmd vertify', () => {
        const ascii2Hex = new Utils().ascii2hex
        const simulator1 = new HexpowerSimulator(1)
        const test1_1 = simulator1.makeResponse(0x50, 7)
        expect(test1_1[3]).to.equal(0x52)
    })
    it('address vertify', () => {
        const ascii2Hex = new Utils().ascii2hex
        const simulator1 = new HexpowerSimulator(1)
        const test1_1 = simulator1.makeResponse(0x50, 7)
        const test1_2 = simulator1.makeResponse(0x60, 8)

        expect(ascii2Hex(test1_1.slice(4, 8))).to.equal(0x50)
        expect(ascii2Hex(test1_2.slice(4, 8))).to.equal(0x60)
    })
    it.only('data check ', () => {
        const ascii2Hex = new Utils().ascii2hex
        const simulator1 = new HexpowerSimulator(1)

        const data1 = [1, 2, 3, 4, 5, 6, 7]
        const data2 = [1, 2, 3, 4, 5, 6, 7, 8]

        const test1_1 = simulator1.makeResponse(0x50, data1)
        const test1_2 = simulator1.makeResponse(0x60, data2)

        expect(ascii2Hex(test1_1.slice(4, 8))).to.equal(0x50)
        expect(ascii2Hex(test1_2.slice(4, 8))).to.equal(0x60)
    })
})
