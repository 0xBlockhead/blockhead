import { throwHttpError } from '$/lib/http.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { getJson, httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/KaspaNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type {
	KaspaNodeBlock,
	KaspaNodeBlockDagInfo,
	KaspaNodeServerInfo,
	KaspaNodeTransaction,
	KaspaNodeUtxo,
	KaspaNodeVirtualChain,
} from '$/sources/KaspaNode/Rest/types.ts'

const binding = bindings[Source.KaspaNode_Rest][0]

const get = <_Value>(path: string) => getJson<_Value>(binding, path)

const unsignedDecimal = (value: string, label: string) => {
	if (!/^(0|[1-9][0-9]*)$/.test(value))
		throw new Error(`KaspaNode_Rest: invalid ${label}`)
	return value
}

const validateDag = (value: KaspaNodeBlockDagInfo) => {
	try {
		if (!Number.isSafeInteger(value.blockCount) || value.blockCount < 0 || !Number.isFinite(value.difficulty) || value.pastMedianTime < 0)
			throw new Error()
		unsignedDecimal(value.virtualDaaScore, 'virtual DAA score')
		if (value.tipHashes.some((hash) => !/^[0-9a-f]{64}$/.test(hash)) || value.virtualParentHashes.some((hash) => !/^[0-9a-f]{64}$/.test(hash)))
			throw new Error()
	} catch {
		throw new Error('KaspaNode_Rest: invalid blockdag response envelope')
	}
	return value
}

const validateServer = (value: KaspaNodeServerInfo) => {
	if (value.serverVersion.length === 0 || value.networkId.length === 0)
		throw new Error('KaspaNode_Rest: invalid server-info response envelope')
	return value
}

export const getBlockDagInfo = async () => validateDag(await get<KaspaNodeBlockDagInfo>('/info/blockdag'))
export const getServerInfo = async () => validateServer(await get<KaspaNodeServerInfo>('/info/kaspad'))

export const getAddressBalance = ({ address }: { address: string }) => (
	get<{ address: string; balance: string }>('/addresses/' + encodeURIComponent(address) + '/balance')
)

export const getAddressUtxos = ({ address }: { address: string }) => (
	get<KaspaNodeUtxo[]>('/addresses/' + encodeURIComponent(address) + '/utxos')
)

export const getBlock = ({ blockHash }: { blockHash: string }) => (
	get<KaspaNodeBlock>('/blocks/' + encodeURIComponent(blockHash) + '?includeTransactions=true')
)

export const getTransaction = ({ transactionId }: { transactionId: string }) => (
	get<KaspaNodeTransaction>('/transactions/' + encodeURIComponent(transactionId) + '?inputs=true&outputs=true')
)

export const getVirtualChain = ({ startHash, minConfirmationCount }: {
	startHash: string
	minConfirmationCount?: number
}) => get<KaspaNodeVirtualChain>(
	'/info/virtual-chain-from-block/' + encodeURIComponent(startHash)
	+ (minConfirmationCount == null ? '' : `?min_confirmation_count=${minConfirmationCount}`)
)

export const getText = async (path: string) => {
	const response = await sourceFetch(binding, httpUrl(binding, path))
	if (!response.ok)
		await throwHttpError(`${binding.source} ${path}`, response)
	return response.text()
}
