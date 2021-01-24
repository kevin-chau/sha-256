// Tests the SHA-256 implementation
var expect = require("chai").expect;
var sha256 = require("../src/sha256");

describe("SHA-256 Test", function() {
  describe("Rotate Right", function() {
    it("Rotates a 32 bit integer to the right", function() {
      const input = 0b00000000000000000011111111111111;
      result = sha256.rotateRight(input, 7);
      resultTwosComplement = (result >>> 0).toString(2);
      expect(resultTwosComplement).to.equal("11111110000000000000000001111111");
    });
  });
});
