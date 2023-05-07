export default function checkToken(tokenClient: string) {
    var SHA256 = require("crypto-js/sha256");
    var tokenServer= SHA256(process.env.NEXT_PUBLIC_SECRET).toString();
    if (tokenClient === tokenServer) {
        return true;
    }
    return false;
}
