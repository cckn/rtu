import { expect } from "chai"
import { Utils } from "../src/utils"

describe("Hex to Ascii", () => {
    it("value가 정확히 변경되는지 확인", () => {
        const utils = new Utils()
        expect(utils.hex2ascii(1, 1)).deep.equal([0x01])
        expect(utils.hex2ascii(255, 1)).deep.equal([0xff])
    })
})
