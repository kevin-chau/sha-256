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
function ch(x,y,z)
{
  return (x & y) ^ (~x & z);
}

// Majority Function
function maj(x,y,z)
{
  return (x & y) ^ (x & z) ^ (y & z);
}

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

  // Break message into chunks of 512
  // // TODO:

  // Create length 64 array message schedule of 32 bit words
  var w = new Array(64).fill(0);
  // copy chunk into first 16 words w[0..15] of the message schedule array
  for (var i = 0; i < 16; i++) {
      w[i] = parseInt(m.substring(i,i+32),2);
  }
  // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array:
  for (var i = 16; i < 64; i++) {
    w[i] = w[i-16] + s0(w[i-15]) + w[i-7] + s1(w[i-2]);
  }

  // Initialize working variables to current hash values
  var a = h0;
  var b = h1;
  var c = h2;
  var d = h3;
  var e = h4;
  var f = h5;
  var g = h6;
  var h = h7;

  // Compression function main loop
  for (var i = 0; i < 64; i++)
  {
      // Calculate intermediate values
      usig1 = S1(e);
      choice = ch(e, f, g);
      temp1 = h + usig1 + choice + k[i] + w[i];
      usig0 = S0(a);
      majority = maj(a,b,c);
      temp2 = usig0 + majority;

      // Update hash values
      h = g;
      g = f;
      f = e;
      e = d + temp1;
      d = c;
      c = b;
      b = a;
      a = temp1 + temp2;
  }

   //Add the compressed chunk to the current hash value:
  h0 = h0 + a;
  h1 = h1 + b;
  h2 = h2 + c;
  h3 = h3 + d;
  h4 = h4 + e;
  h5 = h5 + f;
  h6 = h6 + g;
  h7 = h7 + h;

  var h0x = (h0>>>0).toString(16);
  var h1x = (h1>>>0).toString(16);
  var h2x = (h2>>>0).toString(16);
  var h3x = (h3>>>0).toString(16);
  var h4x = (h4>>>0).toString(16);
  var h5x = (h5>>>0).toString(16);
  var h6x = (h6>>>0).toString(16);
  var h7x = (h7>>>0).toString(16);

  var digest = "0x" + h0x + h1x + h2x + h3x + h4x + h5x + h6x + h7x;
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
exports.ch = ch;
exports.maj = maj;
