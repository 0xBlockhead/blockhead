const signedInt32Minimum = -(2 ** 31)
const signedInt32Maximum = 2 ** 31 - 1
const signedInt64Maximum = (2n ** 63n) - 1n

export const tonCenterV3RawAddress = (address: string) => {
	const coordinates = /^(-?\d+):([0-9a-fA-F]{64})$/.exec(address)
	const workchain = Number(coordinates?.[1])
	if (
		coordinates == null
		|| !Number.isSafeInteger(workchain)
		|| workchain < signedInt32Minimum
		|| workchain > signedInt32Maximum
	)
		throw new Error('TonCenter_V3_Rest: malformed raw TON address')

	return `${workchain}:${coordinates[2].toLowerCase()}`
}

export const tonCenterV3Hash = (
	hash: string,
	fieldName: string
) => {
	if (/^[0-9a-fA-F]{64}$/.test(hash))
		return hash.toLowerCase()

	try {
		const normalizedBase64 = hash
			.replaceAll('-', '+')
			.replaceAll('_', '/')
			.padEnd(Math.ceil(hash.length / 4) * 4, '=')
		const bytes = Uint8Array.from(
			globalThis.atob(normalizedBase64),
			(character) => character.charCodeAt(0)
		)
		if (bytes.length !== 32)
			throw new Error()

		return [...bytes]
			.map((byte) => byte.toString(16).padStart(2, '0'))
			.join('')
	} catch {
		throw new Error(`TonCenter_V3_Rest: malformed ${fieldName}`)
	}
}

export const tonCenterV3Shard = (shard: string) => {
	if (!/^[0-9a-fA-F]{16}$/.test(shard))
		throw new Error('TonCenter_V3_Rest: malformed shard')

	return shard.toLowerCase()
}

export const tonCenterV3NonnegativeInt64 = (
	value: string,
	fieldName: string
) => {
	if (!/^(?:0|[1-9]\d*)$/.test(value))
		throw new Error(`TonCenter_V3_Rest: malformed ${fieldName}`)

	const integer = BigInt(value)
	if (integer > signedInt64Maximum)
		throw new Error(`TonCenter_V3_Rest: ${fieldName} exceeds signed int64`)

	return integer
}

export const tonCenterV3NonnegativeInteger = (
	value: string,
	fieldName: string
) => {
	if (!/^(?:0|[1-9]\d*)$/.test(value))
		throw new Error(`TonCenter_V3_Rest: malformed ${fieldName}`)

	return BigInt(value)
}

export const tonCenterV3NonnegativeSafeInteger = (
	value: number,
	fieldName: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`TonCenter_V3_Rest: malformed ${fieldName}`)

	return value
}
