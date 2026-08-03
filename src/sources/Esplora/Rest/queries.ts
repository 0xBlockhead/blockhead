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

const bindingByTarget = Object.fromEntries(
	bindings[Source.Esplora_Rest].map((binding) => [binding.target.key, binding])
)

const getEsploraJson = <_Response>(target: string, path: string) => {
	const binding = bindingByTarget[target]

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
	target: string
}) => (
	getEsploraJson<EsploraBlock>(target, `/block/${blockHash}`)
)

export const getBlockHashByHeight = ({
	height,
	target,
}: {
	height: bigint
	target: string
}) => (
	getEsploraJson<string>(target, `/block-height/${height.toString()}`)
)

export const getTransaction = ({
	target,
	txId,
}: {
	target: string
	txId: string
}) => (
	getEsploraJson<EsploraTransaction>(target, `/tx/${txId}`)
)

export const getMempoolTransactionIds = (target: string) => (
	getEsploraJson<string[]>(target, '/mempool/txids')
)

export const getAsset = ({
	assetId,
	target,
}: {
	assetId: string
	target: string
}) => (
	getEsploraJson<EsploraAsset>(target, `/asset/${assetId}`)
)

export const listRegistryAssets = ({
	target,
}: {
	target: string
}) => (
	getEsploraJson<EsploraAsset[]>(target, '/assets/registry')
)
