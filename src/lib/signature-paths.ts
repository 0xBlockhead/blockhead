export const normalizeEvmSelectorHex = (hex: string): `0x${string}` => {
	const digits = (
		hex.toLowerCase().startsWith('0x') ?
			hex.slice(2).toLowerCase()
		:
			hex.toLowerCase()
	)
	return `0x${digits.padStart(8, '0').slice(-8)}`
}

export const normalizeEvmTopicHex = (hex: string): `0x${string}` => {
	const digits = (
		hex.toLowerCase().startsWith('0x') ?
			hex.slice(2).toLowerCase()
		:
			hex.toLowerCase()
	)
	return `0x${digits.padStart(64, '0').slice(-64)}`
}
