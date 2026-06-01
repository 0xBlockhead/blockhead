import { resolve } from '$app/paths'


export const normalizeEvmSelectorHex = (hex: string): string => {
	const digits = hex.toLowerCase().startsWith('0x') ? hex.slice(2).toLowerCase()
	:
		hex.toLowerCase()
	return `0x${digits.padStart(8, '0').slice(-8)}`
}

export const normalizeEvmTopicHex = (hex: string): string => {
	const digits = hex.toLowerCase().startsWith('0x') ? hex.slice(2).toLowerCase()
	:
		hex.toLowerCase()
	return `0x${digits.padStart(64, '0').slice(-64)}`
}

export const getEvmSelectorPath = (hex: string) => (
	resolve('/(explore)/(evm)/evm/(selectors)/selector/[hex]', {
		hex: normalizeEvmSelectorHex(hex),
	})
)

export const getEvmTopicPath = (hex: string) => (
	resolve('/(explore)/(evm)/evm/(topics)/topic/[hex]', {
		hex: normalizeEvmTopicHex(hex),
	})
)

export const getEvmErrorPath = (hex: string) => (
	resolve('/(explore)/(evm)/evm/(errors)/error/[hex]', {
		hex: hex.toLowerCase().startsWith('0x') ? hex.toLowerCase()
		:
			`0x${hex.toLowerCase()}`,
	})
)
