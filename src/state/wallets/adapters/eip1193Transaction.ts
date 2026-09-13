import { type } from 'arktype'
import { EvmAddress, EvmRpcQuantity, Hash32, ZeroExHex } from '$/schema/ZeroExHex.ts'
import type { Eip1193Provider } from './eip1193.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import {
	WalletAdapterPreDispatchFailure,
	WalletAdapterProviderRejection,
	WalletAdapterResponseAuditFailure,
} from './types.ts'


const transaction = type({
	chainId: 'number.integer > 0',
	from: EvmAddress,
	to: EvmAddress,
	data: ZeroExHex,
	value: 'bigint',
})
const providerError = type({ code: 'number.integer', message: 'string' })

export type WalletEvmTransaction = typeof transaction.infer

/** One EVM call, never a sequential approximation of an atomic wallet batch. */
export const sendEip1193Transaction = async (
	provider: Eip1193Provider,
	input: WalletEvmTransaction,
	assertAuthorityCurrent: () => void
) => {
	const request = provider.request.bind(provider)
	let params: { chainId: string, from: string, to: string, data: string, value: string }
	try {
		const call = transaction.assert(input)
		if (!Number.isSafeInteger(call.chainId) || call.data.length % 2 !== 0 || call.value < 0n || call.value >= 2n ** 256n)
			throw new Error('Transaction chain, bytes or value are out of range')
		// Snapshot the exact request before any asynchronous provider interaction.
		params = {
			chainId: `0x${call.chainId.toString(16)}`,
			from: call.from,
			to: call.to,
			data: call.data,
			value: `0x${call.value.toString(16)}`,
		}
		assertAuthorityCurrent()
		const chainId = EvmRpcQuantity.assert(await request({ method: 'eth_chainId', params: [] }))
		if (BigInt(chainId) !== BigInt(params.chainId))
			throw new Error('Wallet chain no longer matches the authorized transaction')
		const accounts = EvmAddress.array().assert(await request({ method: 'eth_accounts', params: [] }))
		if (!accounts.some((account) => account.toLowerCase() === params.from.toLowerCase()))
			throw new Error('Wallet no longer exposes the authorized sender')
		assertAuthorityCurrent()
	} catch (error) {
		throw new WalletAdapterPreDispatchFailure(error instanceof Error ? error.message : String(error))
	}

	// No retry: a transport rejection after this boundary may hide a broadcast.
	let result: JsonValue
	try {
		result = await request({ method: 'eth_sendTransaction', params: [params] })
	} catch (error) {
		const rejection = providerError(error)
		if (!(rejection instanceof type.errors) && [4001, 4100, 4200].includes(rejection.code))
			throw new WalletAdapterProviderRejection(rejection.message, rejection.code)
		throw error
	}
	const hash = Hash32(result)
	if (hash instanceof type.errors)
		throw new WalletAdapterResponseAuditFailure('Wallet returned an invalid transaction hash; do not resubmit automatically', result)
	return hash
}
