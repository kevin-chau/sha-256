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
  return x >> n;
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

// Exports
exports.rotateRight = rotateRight;
exports.shiftRight = shiftRight;
exports.s0 = s0;
