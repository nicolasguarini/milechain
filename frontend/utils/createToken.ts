
export function createToken(address: string) {
    var SHA256 = require("crypto-js/sha256");
    return SHA256(address+process.env.NEXT_PUBLIC_SECRET).toString();
}