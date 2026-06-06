import { CID } from 'multiformats/cid'
import { bases } from 'multiformats/basics'

type MultibaseCodecFromBasics = (typeof bases)[keyof typeof bases]

const multibaseCodecTable: Partial<Record<string, MultibaseCodecFromBasics>> = {}

for (const base of Object.values(bases)) {
	multibaseCodecTable[String(base.prefix)] = base
}

const dnsLabelMaxLength = 63

export type DecodedIpfsCid = {
	version: number
	multibase: string
	multicodecCode: number
	multihashCode: number
	multihashDigestHex: `0x${string}`
	isSubdomainSafe: boolean
}

export type IpfsCidEncodingRow = {
	version: number
	baseName: string
	cidString: string
}

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

export const decodeIpfsCid = (value: string): DecodedIpfsCid | null => {
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

export const getAllIpfsCidEncodings = (cid: CID): IpfsCidEncodingRow[] => (
	[
		{
			version: 0,
			baseName: 'base58btc',
			getCidString: () => cid.toV0().toString(),
		},
		...Object.values(bases).map((base) => ({
			version: 1 as const,
			baseName: base.name,
			getCidString: () => cid.toV1().toString(base),
		})),
	].flatMap((row) => {
		try {
			return [{
				version: row.version,
				baseName: row.baseName,
				cidString: row.getCidString(),
			}]
		} catch {
			return []
		}
	})
)

export const checkIpfsCidIsValidSubdomain = ({
	baseName,
	cidString,
}: {
	baseName: string
	cidString: string
}): boolean | undefined => (
	baseName === 'base32' || baseName === 'base36' ?
		cidString.length <= dnsLabelMaxLength
	:
		undefined
)

export const currentMultibaseNameForCidTarget = (target: string, cid: CID): string => (
	cid.version === 0 ?
		'base58btc'
	:
		multibaseCodecTable[target.trim().slice(0, 1)]?.name ?? ''
)
