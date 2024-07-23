#!/usr/bin/env node

// These keys are used for signing PODs. PODs are signed using EdDSA signatures.

// The private keys can be any 32 bytes encoded as Base64 or hex.
// You can change this to your own private key you choose
const EDDSA_PRIVATE_KEY =
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

const POD = require("@pcd/pod");
const EDDSA = require("@zk-kit/eddsa-poseidon");

const privateKeyBytes = POD.decodePrivateKey(EDDSA_PRIVATE_KEY);
const unpackedPublicKey = EDDSA.derivePublicKey(privateKeyBytes);
const publicKey = POD.encodePublicKey(unpackedPublicKey);

console.log(publicKey);
