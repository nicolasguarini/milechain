
export function createToken() {
    var SHA256 = require("crypto-js/sha256");
    return SHA256(process.env.NEXT_PUBLIC_SECRET).toString();
}