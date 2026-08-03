import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import bindings from '$/sources/AvalanchePlatformVm/bindings.ts'
import type {
	AvalanchePlatformVmBalance,
	AvalanchePlatformVmBlockchains,
	AvalanchePlatformVmHeight,
	AvalanchePlatformVmStake,
	AvalanchePlatformVmTxStatus,
	AvalanchePlatformVmUtxoIndex,
	AvalanchePlatformVmUtxos,
	AvalanchePlatformVmValidators,
} from '$/sources/AvalanchePlatformVm/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.AvalanchePlatformVm_JsonRpc][0]

const request = <_Result>(
	method: string,
	params?: Readonly<Record<string, unknown>>
) => jsonRpc2<_Result>(binding, method, params)

export const getHeight = () => (
	request<AvalanchePlatformVmHeight>('platform.getHeight')
)

export const getBlockchains = () => (
	request<AvalanchePlatformVmBlockchains>('platform.getBlockchains')
)

export const getCurrentValidators = (
	params: {
		subnetID?: string
		nodeIDs?: string[]
	} = {}
) => (
	request<AvalanchePlatformVmValidators>('platform.getCurrentValidators', params)
)

export const getBalance = (
	addresses: string[]
) => (
	request<AvalanchePlatformVmBalance>('platform.getBalance', { addresses })
)

export const getStake = (
	addresses: string[],
	validatorsOnly = false
) => (
	request<AvalanchePlatformVmStake>('platform.getStake', {
		addresses,
		validatorsOnly,
	})
)

export const getTxStatus = (
	txID: string
) => (
	request<AvalanchePlatformVmTxStatus>('platform.getTxStatus', { txID })
)

export const getUtxos = async (
	addresses: string[],
	limit: number
) => {
	if (!Number.isSafeInteger(limit) || limit < 0)
		throw new Error('AvalanchePlatformVm_JsonRpc: UTXO limit must be a nonnegative safe integer')

	const utxos = new Set<string>()
	const seenIndexes = new Set<string>()
	let startIndex: AvalanchePlatformVmUtxoIndex | undefined
	let encoding = 'hex'
	while (utxos.size < limit) {
		const pageLimit = Math.min(limit - utxos.size, 1024)
		const page = await request<AvalanchePlatformVmUtxos>('platform.getUTXOs', {
			addresses,
			limit: pageLimit,
			...(startIndex != null && { startIndex }),
			encoding: 'hex',
		})
		encoding = page.encoding
		const previousSize = utxos.size
		for (const utxo of page.utxos)
			if (utxos.size < limit)
				utxos.add(utxo)
		if (
			Number(page.numFetched) < pageLimit
			|| utxos.size === previousSize
		)
			break
		const indexKey = `${page.endIndex.address}:${page.endIndex.utxo}`
		if (seenIndexes.has(indexKey))
			break
		seenIndexes.add(indexKey)
		startIndex = page.endIndex
	}

	return {
		utxos: [...utxos],
		...(startIndex != null && { endIndex: startIndex }),
		encoding,
	}
}
