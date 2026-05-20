import {
	decode as decodeEnsContentHashHex,
	getCodec as getEnsContentHashCodec,
} from '@ensdomains/content-hash'

import { ipfsResourceAddressFromInput, ipfsResourceHref } from '$/lib/ipfs.ts'


export type EnsDecodedContentHash = {
	codec: string
	decoded: string
	canonicalUri: string
}

const isZeroContentHashHex = (hex: string) => (
	/^0x0*$/i.test(hex)
)

export const decodeEnsContentHash = (encodedHex: string): EnsDecodedContentHash | null => {
	const trimmed = encodedHex.trim()
	if (trimmed === '') return null

	const hex = (
		trimmed.startsWith('0x') || trimmed.startsWith('0X') ?
			trimmed
		:
			`0x${trimmed}`
	)
	if (isZeroContentHashHex(hex)) return null

	try {
		const codec = getEnsContentHashCodec(hex)
		const decoded = decodeEnsContentHashHex(hex)
		if (codec == null || decoded === '') return null

		return {
			codec,
			decoded,
			canonicalUri: `${codec}://${decoded}`,
		}
	} catch {
		return null
	}
}

export const ensContentHashBrowseHrefFromCanonicalUri = (canonicalUri: string) => {
	const trimmed = canonicalUri.trim()
	if (trimmed === '') return undefined

	if (
		trimmed.startsWith('ipfs://')
		|| trimmed.startsWith('ipns://')
	) {
		const address = ipfsResourceAddressFromInput({ targetInput: trimmed })
		return address == null ? undefined : ipfsResourceHref(address)
	}

	if (
		trimmed.startsWith('bzz://')
		|| trimmed.startsWith('swarm://')
	) {
		return '/swarm'
	}

	return undefined
}

export const ensContentHashBrowseHref = (contentHash: string) => {
	const decoded = decodeEnsContentHash(contentHash)
	if (decoded != null) {
		return ensContentHashBrowseHrefFromCanonicalUri(decoded.canonicalUri)
	}

	return ensContentHashBrowseHrefFromCanonicalUri(contentHash)
}
