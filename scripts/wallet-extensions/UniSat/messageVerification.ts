import { createHash } from 'node:crypto'
import { base58check } from '@scure/base'
import { CompactSize, Secp256k1 } from 'ox'

const hash160 = (value: Uint8Array) => {
	const sha = createHash('sha256').update(value).digest()
	return createHash('ripemd160').update(sha).digest()
}

const doubleSha256 = (value: Uint8Array) => {
	const first = createHash('sha256').update(value).digest()
	return createHash('sha256').update(first).digest()
}
const base58checkCodec = base58check((value: Uint8Array) => new Uint8Array(createHash('sha256').update(value).digest()))

export const bitcoinSignedMessagePayload = (message: string) => {
	const body = Buffer.from(message, 'utf8')
	const magic = Buffer.from('Bitcoin Signed Message:\n', 'utf8')
	return doubleSha256(Buffer.concat([
		Buffer.from(CompactSize.toBytes(magic.length)),
		magic,
		Buffer.from(CompactSize.toBytes(body.length)),
		body,
	]))
}

export const verifyBitcoinSignedMessage = ({
	address,
	message,
	publicKey,
	signature,
}: {
	address: string
	message: string
	publicKey: string
	signature: string
}) => {
	const normalizedPublicKey = publicKey.replace(/^0x/, '')
	if (!/^(02|03)[0-9a-f]{64}$/i.test(normalizedPublicKey))
		throw new Error('Only compressed Bitcoin public keys are supported')
	const key = Buffer.from(normalizedPublicKey, 'hex')
	const encoded = Buffer.from(signature, 'base64')
	if (encoded.length !== 65) throw new Error('Bitcoin signed message signature must be 65 bytes')
	if (encoded.toString('base64') !== signature) throw new Error('Bitcoin signed message signature is not canonical base64')
	const header = encoded[0]
	if (header < 27 || header > 34) throw new Error('Invalid Bitcoin ECDSA recovery header')
	const recoveryBit = (header - 27) % 4
	const signatureBytes = encoded.subarray(1)
	const recovered = Secp256k1.noble.Signature.fromBytes(signatureBytes)
		.addRecoveryBit(recoveryBit)
		.recoverPublicKey(bitcoinSignedMessagePayload(message))
	const recoveredKey = `${BigInt(recovered.y) % 2n === 0n ? '02' : '03'}${BigInt(recovered.x).toString(16).padStart(64, '0')}`
	if (recoveredKey.toLowerCase() !== normalizedPublicKey.toLowerCase()) throw new Error('Bitcoin signed message public key mismatch')
	const decoded = base58checkCodec.decode(address)
	if (decoded[0] !== 0 || !Buffer.from(decoded.subarray(1)).equals(hash160(key)))
		throw new Error('Bitcoin signed message address mismatch')
	return true
}
