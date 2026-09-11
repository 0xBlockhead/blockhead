import { Secp256k1, Signature } from 'ox'

export type SafeLocalSignature = `0x${string}`

export type SafeLocalSignatureAggregationInput = {
	payload: `0x${string}`
	owners: readonly `0x${string}`[]
	threshold: number
	signatures: readonly SafeLocalSignature[]
}

const isAddress = (value: string) => /^0x[0-9a-f]{40}$/i.test(value)

/** Prepare Safe owner-sorted signatures without collecting authority or submitting a transaction. */
export const aggregateSafeLocalSignatures = ({
	payload,
	owners,
	threshold,
	signatures,
}: SafeLocalSignatureAggregationInput): SafeLocalSignature => {
	if (!Number.isSafeInteger(threshold) || threshold < 1 || threshold > owners.length)
		throw new Error('Safe threshold must be a safe integer between one and the owner count')
	if (owners.some((owner) => !isAddress(owner)))
		throw new Error('Safe owners must be valid addresses')
	if (owners.length !== new Set(owners.map((owner) => owner.toLowerCase())).size)
		throw new Error('Safe owners must be unique')
	if (signatures.length !== threshold)
		throw new Error('Safe signature count must equal the requested threshold')

	const ownerSet = new Set(owners.map((owner) => owner.toLowerCase()))
	const recovered = signatures.map((signature) => {
		if (!/^0x[0-9a-f]{130}$/i.test(signature))
			throw new Error('Safe signature must be a 65-byte hexadecimal value')
		const parsed = Signature.fromHex(signature)
		const signer = Secp256k1.recoverAddress({ payload, signature: parsed }).toLowerCase()
		if (!ownerSet.has(signer))
			throw new Error('Safe signature was not produced by an owner')
		return { parsed, signer }
	})
	if (new Set(recovered.map(({ signer }) => signer)).size !== recovered.length)
		throw new Error('Safe signatures must be from distinct owners')

	return `0x${recovered
		.sort((left, right) => left.signer < right.signer ? -1 : left.signer > right.signer ? 1 : 0)
		.map(({ parsed }) => Signature.toHex(parsed).slice(2))
		.join('')}`
}
