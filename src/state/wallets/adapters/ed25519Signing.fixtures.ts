import { ed25519 } from '@noble/curves/ed25519.js'
import { base58 } from '@scure/base'

export const ed25519SigningPrivateKey = new Uint8Array([
	7, 19, 31, 43, 59, 71, 83, 97,
	109, 127, 139, 151, 163, 179, 191, 211,
	223, 229, 233, 239, 241, 251, 3, 13,
	23, 37, 47, 61, 73, 89, 101, 113,
])
export const ed25519SiblingPrivateKey = new Uint8Array([
	3, 5, 7, 11, 13, 17, 19, 23,
	29, 31, 37, 41, 43, 47, 53, 59,
	61, 67, 71, 73, 79, 83, 89, 97,
	101, 103, 107, 109, 113, 127, 131, 137,
])
export const solanaSigningPublicKey = ed25519.getPublicKey(ed25519SigningPrivateKey)
export const solanaSigningAccountAddress = base58.encode(solanaSigningPublicKey)
export const solanaSigningMessage = 'Blockhead controlled signing challenge: session 42, revision 3'
