// Tests the SHA-256 implementation
var expect = require("chai").expect;
var sha256 = require("../src/sha256");

// All Tests
describe("SHA-256 Test", function() {

  // Rotate Right 7
  describe("Rotate Right 7", function() {
    it("Rotates a 32 bit integer to the right by 7 bits", function() {
      const input = 0b00000000000000000011111111111111;
      result = sha256.rotateRight(input, 7);
      resultTwosComplement = (result >>> 0).toString(2);
      expect(resultTwosComplement).to.equal("11111110000000000000000001111111");
    });
  });

  // Rotate Right 18
  describe("Rotate Right 18", function() {
    it("Rotates a 32 bit integer to the right by 18 bits", function() {
      const input = 0b00000000000000000011111111111111;
      result = sha256.rotateRight(input, 18);
      expect(result).to.equal(0b1111111111111100000000000000);
    });
  });

  // Shift Right 3
  describe("Shift Right 3", function() {
    it("Shifts a 32 bit integer to the right by 3 bits", function() {
      const input = 0b00000000000000000011111111111111;
      result = sha256.shiftRight(input, 3);
      expect(result).to.equal(0b11111111111);
    });
  });

  // Uppercase sigma zero test
  describe("Uppercase Sigma Zero Test", function() {
    it("Tests the uppercase sigma zero function", function() {
      const input = 0b00000000000000000011111111111111;
      result = sha256.S0(input);
      expect(result).to.equal(0b00111111000001111111001111111110);
    });
  });

  // Uppercase sigma one test
  describe("Uppercase Sigma One Test", function() {
    it("Tests the uppercase sigma one function", function() {
      const input = 0b00000000000000000011111111111111;
      result = sha256.S1(input);
      expect(result).to.equal(0b00000011111111111111111101111000);
    });
  });

  describe("rotate right Test", function() {
    it("Tests the rotate right function", function() {
      const input = 0b10000000000000000000000000000000;
      result = sha256.rotateRight(input,17);
      expect(result).to.equal(0b00000000000000000100000000000000);
    });
  });

  // Uppercase sigma one test
  describe("Lowercase Sigma One Test", function() {
    it("Tests the lowercase sigma one function on w16", function() {
      const input = 0b10000000000000000000000000000000;
      res = sha256.s1(input);
      expect(res).to.equal(0b00000000001000000101000000000000);
    });
  });

  // low sigma zero test
  describe("Lowercase Sigma Zero Test", function() {
    it("Tests the lowercase sigma zero function", function() {
      const input = 0b00000000000000000011111111111111;
      result = sha256.s0(input);
      resultTwosComplement = (result >>> 0).toString(2);
      expect(resultTwosComplement).to.equal("11110001111111111100011110000000");
    });
  });

  // low sigma one test
  describe("Lowercase Sigma One Test", function() {
    it("Tests the lowervase sigma one function", function() {
      const input = 0b00000000000000000011111111111111;
      result = sha256.s1(input);
      expect(result).to.equal(0b00011000000000000110000000001111);
    });
  });

  // test ch
  describe("Ch Test", function() {
    it("Tests choice function", function() {
      const x = 0b00000000111111110000000011111111;
      const y = 0b00000000000000001111111111111111;
      const z = 0b11111111111111110000000000000000;
      result = sha256.ch(x,y,z);
      resultTwosComplement = (result >>> 0).toString(2);
      expect(resultTwosComplement).to.equal("11111111000000000000000011111111");
    });
  });

  // test maj
  describe("Maj Test", function() {
    it("Tests Majority function", function() {
      const x = 0b00000000111111110000000011111111;
      const y = 0b00000000000000001111111111111111;
      const z = 0b11111111111111110000000000000000;
      result = sha256.maj(x,y,z);
      // resultTwosComplement = (result >>> 0).toString(2);
      expect(result).to.equal(0b00000000111111110000000011111111);
    });
  });

  // test sha256
  describe("SHA-256 EMPTY STRING", function() {
    it("Tests the empty string (zero-length) input message", function() {
      const input = "";
      result = sha256.sha256(input);
      expect(result).to.equal("0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    });
  });
});
