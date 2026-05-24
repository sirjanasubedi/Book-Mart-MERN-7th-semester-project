const crypto = require("crypto");

const generateEsewaSignature = (message, secret) =>
  crypto.createHmac("sha256", secret).update(message).digest("base64");

module.exports = generateEsewaSignature;