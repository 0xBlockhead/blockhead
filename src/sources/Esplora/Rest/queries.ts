import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Esplora/bindings.ts'
import {
	assertEsploraEnvelope,
	esploraAssetWire,
	esploraBlockWire,
	esploraTransactionWire,
} from '$/sources/Esplora/Rest/envelopes.ts'
import { Source } from '$/sources/Source.ts'
import { type as arktype } from 'arktype'

type EsploraTarget = typeof bindings[Source.Esplora_Rest][number]['target']['key']

const bindingByTarget = new Map(
	bindings[Source.Esplora_Rest].map((binding) => [binding.target.key, binding] as const)
)

const blockHashWire = arktype('/^[0-9a-fA-F]{64}$/')
const txIdListWire = arktype('/^[0-9a-f]{64}$/').array()

const getEsploraJson = async <_Response>(
	target: EsploraTarget,
	path: string
) => {
	const binding = bindingByTarget.get(target)
	if (binding == null)
		throw new Error(`Esplora_Rest: unsupported source target ${target}`)

	return sourceGetJson<_Response>(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}${path}`
	)
}

export const getBlock = async ({
	blockHash,
	target,
}: {
	blockHash: string
	target: EsploraTarget
}) => (
	assertEsploraEnvelope(
		esploraBlockWire,
		await getEsploraJson(target, `/block/${blockHash}`),
		'block'
	)
)

export const getBlockHashByHeight = async ({
	height,
	target,
}: {
	height: bigint
	target: EsploraTarget
}) => {
	const hash = await getEsploraJson<unknown>(target, `/block-height/${height.toString()}`)
	if (!blockHashWire.allows(hash))
		throw new Error('Esplora_Rest: invalid block hash envelope')
	return hash
}

export const getTransaction = async ({
	target,
	txId,
}: {
	target: EsploraTarget
	txId: string
}) => (
	assertEsploraEnvelope(
		esploraTransactionWire,
		await getEsploraJson(target, `/tx/${txId}`),
		'transaction'
	)
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

export const getMempoolTransactionIds = async (target: EsploraTarget) => (
	assertEsploraEnvelope(
		txIdListWire,
		await getEsploraJson(target, '/mempool/txids'),
		'mempool txids'
	)
)

export const getAsset = async ({
	assetId,
	target,
}: {
	assetId: string
	target: EsploraTarget
}) => (
	assertEsploraEnvelope(
		esploraAssetWire,
		await getEsploraJson(target, `/asset/${assetId}`),
		'asset'
	)
)

export const listRegistryAssets = async ({
	target,
}: {
	target: EsploraTarget
}) => (
	assertEsploraEnvelope(
		esploraAssetWire.array(),
		await getEsploraJson(target, '/assets/registry'),
		'asset registry'
	)
)
