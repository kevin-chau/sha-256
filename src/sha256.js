/* SHA-256 Sigma Functions defined in NIST FIPS 180-4 */

const WORD_LENGTH = 32;

// Rotate a 32 bit integer to the right by n bits
function rotateRight(x, n)
{
  return (x << (WORD_LENGTH - n))| (x >>> n);
}

// Shift a 32 bit integer to the right by n bits
function shiftRight(x, n)
{
  return x >>> n;
}

// Choice function

// Upper-case Sigma 0
const UP_SIGMA_ZERO_CONST_1 = 2;
const UP_SIGMA_ZERO_CONST_2 = 13;
const UP_SIGMA_ZERO_CONST_3 = 22;
function S0 (x)
{
  return rotateRight(x, UP_SIGMA_ZERO_CONST_1) ^
         rotateRight(x, UP_SIGMA_ZERO_CONST_2) ^
         rotateRight(x, UP_SIGMA_ZERO_CONST_3);
}

// Upper-case sigma 1
const UP_SIGMA_ONE_CONST_1 = 6;
const UP_SIGMA_ONE_CONST_2 = 11;
const UP_SIGMA_ONE_CONST_3 = 25;
function S1 (x)
{
  return rotateRight(x, UP_SIGMA_ONE_CONST_1) ^
         rotateRight(x, UP_SIGMA_ONE_CONST_2) ^
         rotateRight(x, UP_SIGMA_ONE_CONST_3);
}


// Lower-case sigma 0
const LOW_SIGMA_ZERO_CONST_1 = 7;
const LOW_SIGMA_ZERO_CONST_2 = 18;
const LOW_SIGMA_ZERO_CONST_3 = 3;
function s0 (x)
{
  return rotateRight(x, LOW_SIGMA_ZERO_CONST_1) ^
         rotateRight(x, LOW_SIGMA_ZERO_CONST_2) ^
         shiftRight(x, LOW_SIGMA_ZERO_CONST_3);
}

// Lower-case sigma 1
const LOW_SIGMA_ONE_CONST_1 = 17;
const LOW_SIGMA_ONE_CONST_2 = 19;
const LOW_SIGMA_ONE_CONST_3 = 10;
function s1 (x)
{
  console.log(rotateRight(x, LOW_SIGMA_ONE_CONST_1).toString(2));
  console.log(rotateRight(x, LOW_SIGMA_ONE_CONST_2).toString(2));
  console.log(shiftRight(x, LOW_SIGMA_ONE_CONST_3).toString(2));
  return rotateRight(x, LOW_SIGMA_ONE_CONST_1) ^
         rotateRight(x, LOW_SIGMA_ONE_CONST_2) ^
         shiftRight(x, LOW_SIGMA_ONE_CONST_3);
}

// pad
function pad(s, size) {
    while (s.length < size) s = "0" + s;
    return s;
}

function pad64(s) {
    return pad(s, 64);
}

/* SHA 256 */
function sha256(message)
{
  // Initialize hash values:
  // (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
  var h0 = 0x6a09e667
  var h1 = 0xbb67ae85
  var h2 = 0x3c6ef372
  var h3 = 0xa54ff53a
  var h4 = 0x510e527f
  var h5 = 0x9b05688c
  var h6 = 0x1f83d9ab
  var h7 = 0x5be0cd19
  // Initialize array of round constants:
  // (first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311):
  var k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  // Pre-processing (Padding):
  // begin with the original message of length L bits
  // append a single '1' bit
  // append K '0' bits, where K is the minimum number >= 0 such that L + 1 + K + 64 is a multiple of 512
  // append L as a 64-bit big-endian integer, making the total post-processed length a multiple of 512 bits
  var m = "";

  // Convert message to binary
  for (var i = 0; i < message.length; i++) {
      m += message[i].charCodeAt(0).toString(2);
  }

  var L = m.length;
  // Append single bit TODO: deal with larger K cases
  m += "1";
  var K = 512 - L - 1 - 64;
  // Pad 0
  for (var i = 0; i < K; i++) {
      m += "0";
  }
  // Append length as 64 bit big endian integer
  m += pad64(L.toString(2));

  console.log("PREPROCESSED MESSAGE:");
  console.log(m);
  console.log("length:");
  console.log(m.length);

  // Break message into chunks of 512
  // // TODO:

  // Create length 64 array message schedule of 32 bit words
  var w = new Array(64).fill(0);
  // copy chunk into first 16 words w[0..15] of the message schedule array
  for (var i = 0; i < 16; i++) {
      w[i] = parseInt(m.substring(i,i+32),2);
      console.log("w" + i.toString() + ": " + pad(w[i].toString(2),32));
  }
  // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array:
  for (var i = 16; i < 64; i++) {
    w[i] = w[i-16] + s0(w[i-15]) + w[i-7] + s1(w[i-2]);
    if (i == 18){
      console.log(w[i-16]);
      console.log(s0(w[i-15]));
      console.log(s1(w[i-2]));
      console.log(w[i-7]);
      console.log(w[i]);
      console.log((w[i]>>>0).toString(2));
    }
    console.log("w" + i.toString() + ": " + pad((w[i]>>>0).toString(2),32));
  }


  var digest = "";
  return digest;
}

// Exports
exports.rotateRight = rotateRight;
exports.shiftRight = shiftRight;
exports.s0 = s0;
exports.s1 = s1;
exports.S0 = S0;
exports.S1 = S1;
exports.sha256 = sha256;
