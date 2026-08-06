import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Esplora/bindings.ts'
import type {
	EsploraAsset,
	EsploraBlock,
	EsploraTransaction,
} from '$/sources/Esplora/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type EsploraTarget = typeof bindings[Source.Esplora_Rest][number]['target']['key']

const bindingByTarget = new Map(
	bindings[Source.Esplora_Rest].map((binding) => [binding.target.key, binding] as const)
)

const getEsploraJson = <_Response>(target: EsploraTarget, path: string) => {
	const binding = bindingByTarget.get(target)
	if (binding == null)
		throw new Error(`Esplora_Rest: unsupported source target ${target}`)

	return sourceGetJson<_Response>(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}${path}`
	)
}

export const getBlock = ({
	blockHash,
	target,
}: {
	blockHash: string
	target: EsploraTarget
}) => (
	getEsploraJson<EsploraBlock>(target, `/block/${blockHash}`)
)

export const getBlockHashByHeight = ({
	height,
	target,
}: {
	height: bigint
	target: EsploraTarget
}) => (
	getEsploraJson<string>(target, `/block-height/${height.toString()}`)
)

export const getTransaction = ({
	target,
	txId,
}: {
	target: EsploraTarget
	txId: string
}) => (
	getEsploraJson<EsploraTransaction>(target, `/tx/${txId}`)
)

/**
 * Extract Ordinals envelopes + Runestone from an Esplora transaction wire.
 * @see https://docs.ordinals.com/inscriptions.html
 * @see https://docs.ordinals.com/runes/specification.html
 */
export const getTransactionProtocolPayloads = async ({
	target,
	txId,
}: {
	target: EsploraTarget
	txId: string
}) => {
	const { extractEsploraProtocolPayloads } = await import('$/sources/BitcoinCore/JsonRpc/protocol.ts')
	return extractEsploraProtocolPayloads(
		await getTransaction({
			target,
			txId,
		})
	)
}

export const getMempoolTransactionIds = (target: EsploraTarget) => (
	getEsploraJson<string[]>(target, '/mempool/txids')
)

export const getAsset = ({
	assetId,
	target,
}: {
	assetId: string
	target: EsploraTarget
}) => (
	getEsploraJson<EsploraAsset>(target, `/asset/${assetId}`)
)

export const listRegistryAssets = ({
	target,
}: {
	target: EsploraTarget
}) => (
	getEsploraJson<EsploraAsset[]>(target, '/assets/registry')
)
