import { CID } from 'multiformats/cid'
import { bases } from 'multiformats/basics'

type MultibaseCodecFromBasics = (typeof bases)[keyof typeof bases]

const multibaseCodecTable: Partial<Record<string, MultibaseCodecFromBasics>> = {}

for (const base of Object.values(bases)) {
	multibaseCodecTable[String(base.prefix)] = base
}

const dnsLabelMaxLength = 63

export const parseIpfsCid = (value: string): CID | null => {
	const trimmed = value.trim()
	if (trimmed === '') return null

	try {
		const base = multibaseCodecTable[trimmed.slice(0, 1)]
		if (base !== undefined) return CID.parse(trimmed, base)
	} catch {
		// fall through
	}

	try {
		return CID.parse(trimmed)
	} catch {
		return null
	}
}

export const decodeIpfsCid = (value: string) => {
	const cid = parseIpfsCid(value)
	if (cid == null) return null

	const multibase = (
		cid.version === 0 ?
			'base58btc'
		:
			multibaseCodecTable[value.trim().slice(0, 1)]?.name ?? 'unknown'
	)

	return {
		version: cid.version,
		multibase,
		multicodecCode: cid.code,
		multihashCode: cid.multihash.code,
		multihashDigestHex: `0x${Array.from(cid.multihash.digest).map((byte) => byte.toString(16).padStart(2, '0')).join('')}`,
		isSubdomainSafe: (
			cid.version === 1
			&& (
				multibase === 'base32'
				|| multibase === 'base36'
			)
			&& value.trim().length <= dnsLabelMaxLength
		),
	}
}

export const canonicalIpfsCidString = (value: string): string | null => {
	const cid = parseIpfsCid(value)
	if (cid == null) return null

	try {
		return cid.toV1().toString(bases.base32)
	} catch {
		return cid.toString()
	}
}
