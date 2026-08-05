import type { JsonObject, JsonValue } from '$/typescript/JsonValue.ts'
import type { WalletTypedData } from './types.ts'

export type Eip1193RequestArguments = {
	method: string
	params?: readonly JsonValue[] | JsonObject
}

export type Eip1193Provider = {
	request(args: Eip1193RequestArguments): Promise<JsonValue>
	on?: (event: string, listener: (payload: JsonValue) => void) => void
	removeListener?: (event: string, listener: (payload: JsonValue) => void) => void
}

const isAddress = (value: JsonValue): value is `0x${string}` => (
	typeof value === 'string'
	&& value.startsWith('0x')
)

const parseHexChainId = (value: JsonValue) => (
	typeof value === 'string' ?
		Number.parseInt(value, 16)
	:
		NaN
)

export const requestAccounts = async (provider: Eip1193Provider) => {
	const accounts = await provider.request({
		method: 'eth_requestAccounts',
		params: [],
	})

	if (!Array.isArray(accounts))
		throw new Error('Provider did not return an accounts array')

	return accounts.filter(isAddress)
}

export const getChainId = async (provider: Eip1193Provider) => {
	const chainId = parseHexChainId(await provider.request({
		method: 'eth_chainId',
		params: [],
	}))

	if (!Number.isFinite(chainId))
		throw new Error('Provider returned an invalid chain ID')

	return chainId
}

export const personalSign = async (
	provider: Eip1193Provider,
	accountAddress: string,
	message: string
) => {
	const signature = await provider.request({
		method: 'personal_sign',
		params: [
			`0x${Array.from(new TextEncoder().encode(message), (byte) => byte.toString(16).padStart(2, '0')).join('')}`,
			accountAddress,
		],
	})
	if (typeof signature !== 'string' || !signature.startsWith('0x'))
		throw new Error('Provider returned an invalid personal_sign signature')

	return signature
}

export const signTypedDataV4 = async (
	provider: Eip1193Provider,
	accountAddress: string,
	typedData: WalletTypedData
) => {
	const signature = await provider.request({
		method: 'eth_signTypedData_v4',
		params: [
			accountAddress,
			{
				types: typedData.types,
				primaryType: typedData.primaryType,
				domain: typedData.domain,
				message: typedData.message,
			},
		],
	})
	if (typeof signature !== 'string' || !signature.startsWith('0x'))
		throw new Error('Provider returned an invalid eth_signTypedData_v4 signature')

	return signature
}

export const switchEthereumChain = async (
	provider: Eip1193Provider,
	chainReference: string
) => {
	await provider.request({
		method: 'wallet_switchEthereumChain',
		params: [
			{
				chainId: `0x${BigInt(chainReference).toString(16)}`,
			},
		],
	})
}

export const onAccountsChanged = (
	provider: Eip1193Provider,
	listener: (accounts: `0x${string}`[]) => void
) => {
	if (typeof provider.on !== 'function') return () => {}

	const handler = (payload: JsonValue) => {
		if (!Array.isArray(payload)) return

		listener(payload.filter(isAddress))
	}

	provider.on('accountsChanged', handler)

	return () => {
		provider.removeListener?.('accountsChanged', handler)
	}
}

export const onChainChanged = (
	provider: Eip1193Provider,
	listener: (chainId: number) => void
) => {
	if (typeof provider.on !== 'function') return () => {}

	const handler = (payload: JsonValue) => {
		const chainId = parseHexChainId(payload)

		if (Number.isFinite(chainId))
			listener(chainId)
	}

	provider.on('chainChanged', handler)

	return () => {
		provider.removeListener?.('chainChanged', handler)
	}
}
