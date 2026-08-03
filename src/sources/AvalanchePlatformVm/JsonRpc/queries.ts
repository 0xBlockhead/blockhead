import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
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

const request = <_Result>(
	binding: SourceBinding,
	method: string,
	params?: Readonly<Record<string, unknown>>
) => jsonRpc2<_Result>(binding, method, params)

export const getHeight = (binding: SourceBinding) => (
	request<AvalanchePlatformVmHeight>(binding, 'platform.getHeight')
)

export const getBlockchains = (binding: SourceBinding) => (
	request<AvalanchePlatformVmBlockchains>(binding, 'platform.getBlockchains')
)

export const getCurrentValidators = (
	binding: SourceBinding,
	params: {
		subnetID?: string
		nodeIDs?: string[]
	} = {}
) => (
	request<AvalanchePlatformVmValidators>(binding, 'platform.getCurrentValidators', params)
)

export const getBalance = (
	binding: SourceBinding,
	addresses: string[]
) => (
	request<AvalanchePlatformVmBalance>(binding, 'platform.getBalance', { addresses })
)

export const getStake = (
	binding: SourceBinding,
	addresses: string[],
	validatorsOnly = false
) => (
	request<AvalanchePlatformVmStake>(binding, 'platform.getStake', {
		addresses,
		validatorsOnly,
	})
)

export const getTxStatus = (
	binding: SourceBinding,
	txID: string
) => (
	request<AvalanchePlatformVmTxStatus>(binding, 'platform.getTxStatus', { txID })
)

export const getUtxos = async (
	binding: SourceBinding,
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
		const page = await request<AvalanchePlatformVmUtxos>(binding, 'platform.getUTXOs', {
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
