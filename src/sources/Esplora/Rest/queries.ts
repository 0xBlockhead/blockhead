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

export const getBlock = ({
	blockHash,
	target,
}: {
	blockHash: string
	target: string
}) => (
	sourceGetJson<EsploraBlock>(
		bindingByTarget[target],
		`${firstHttpUrlForBinding(bindingByTarget[target]).replace(/\/$/, '')}/block/${blockHash}`
	)
)

export const getBlockHashByHeight = ({
	height,
	target,
}: {
	height: bigint
	target: string
}) => (
	sourceGetJson<string>(
		bindingByTarget[target],
		`${firstHttpUrlForBinding(bindingByTarget[target]).replace(/\/$/, '')}/block-height/${height.toString()}`
	)
)

export const getTransaction = ({
	target,
	txId,
}: {
	target: string
	txId: string
}) => (
	sourceGetJson<EsploraTransaction>(
		bindingByTarget[target],
		`${firstHttpUrlForBinding(bindingByTarget[target]).replace(/\/$/, '')}/tx/${txId}`
	)
)

export const getMempoolTransactionIds = (target: string) => (
	sourceGetJson<string[]>(
		bindingByTarget[target],
		`${firstHttpUrlForBinding(bindingByTarget[target]).replace(/\/$/, '')}/mempool/txids`
	)
)

export const getAsset = ({
	assetId,
	target,
}: {
	assetId: string
	target: string
}) => (
	sourceGetJson<EsploraAsset>(
		bindingByTarget[target],
		`${firstHttpUrlForBinding(bindingByTarget[target]).replace(/\/$/, '')}/asset/${assetId}`
	)
)

export const listRegistryAssets = ({
	target,
}: {
	target: string
}) => (
	sourceGetJson<EsploraAsset[]>(
		bindingByTarget[target],
		`${firstHttpUrlForBinding(bindingByTarget[target]).replace(/\/$/, '')}/assets/registry`
	)
)
