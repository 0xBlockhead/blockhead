import { substrateJsonRpc } from '$/sources/_shared/interfaces/SubstrateJsonRpc/client.ts'
import type {
	SubstrateRpcBlock,
	SubstrateRpcHeader,
	SubstrateRuntimeVersion,
	SubstrateSystemHealth,
} from '$/sources/_shared/interfaces/SubstrateJsonRpc/types.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

const hexHash = '/^0x[0-9a-fA-F]+$/'
const hexQuantity = '/^0x[0-9a-fA-F]+$/'

const substrateRpcHeaderWire = arktype({
	parentHash: hexHash,
	number: hexQuantity,
	stateRoot: hexHash,
	extrinsicsRoot: hexHash,
	digest: {
		logs: 'string[]',
	},
})

const substrateRpcBlockWire = arktype({
	block: {
		header: substrateRpcHeaderWire,
		extrinsics: 'string[]',
	},
	'justifications?': 'unknown',
})

const substrateRuntimeVersionWire = arktype({
	specName: 'string > 0',
	implName: 'string > 0',
	authoringVersion: 'number.integer >= 0',
	specVersion: 'number.integer >= 0',
	implVersion: 'number.integer >= 0',
	'transactionVersion?': 'number.integer >= 0',
	'stateVersion?': 'number.integer >= 0',
})

const substrateSystemHealthWire = arktype({
	peers: 'number.integer >= 0',
	isSyncing: 'boolean',
	shouldHavePeers: 'boolean',
})

const substrateBlockHashWire = arktype(hexHash)

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`SubstrateJsonRpc: invalid ${label} response envelope`)
	}
}

export const substrateJsonRpcQueries = (binding: SourceBinding) => ({
	getBlock: async ({
		blockHash,
	}: {
		blockHash: string
	}) => (
		assertEnvelope(
			'block',
			substrateRpcBlockWire,
			await substrateJsonRpc<unknown>({
				binding,
				method: 'chain_getBlock',
				params: [
					blockHash,
				],
			})
		) as SubstrateRpcBlock
	),
	getBlockHash: async ({
		blockNumber,
	}: {
		blockNumber: bigint
	}) => (
		assertEnvelope(
			'block hash',
			substrateBlockHashWire,
			await substrateJsonRpc<unknown>({
				binding,
				method: 'chain_getBlockHash',
				params: [
					`0x${blockNumber.toString(16)}`,
				],
			})
		)
	),
	getFinalizedHead: async () => (
		assertEnvelope(
			'finalized head',
			substrateBlockHashWire,
			await substrateJsonRpc<unknown>({
				binding,
				method: 'chain_getFinalizedHead',
			})
		)
	),
	getHeader: async ({
		blockHash,
	}: {
		blockHash?: string
	} = {}) => (
		assertEnvelope(
			'header',
			substrateRpcHeaderWire,
			await substrateJsonRpc<unknown>({
				binding,
				method: 'chain_getHeader',
				params: blockHash == null ? [] : [
					blockHash,
				],
			})
		) as SubstrateRpcHeader
	),
	getRuntimeVersion: async () => (
		assertEnvelope(
			'runtime version',
			substrateRuntimeVersionWire,
			await substrateJsonRpc<unknown>({
				binding,
				method: 'state_getRuntimeVersion',
			})
		) as SubstrateRuntimeVersion
	),
	getSystemHealth: async () => (
		assertEnvelope(
			'system health',
			substrateSystemHealthWire,
			await substrateJsonRpc<unknown>({
				binding,
				method: 'system_health',
			})
		) as SubstrateSystemHealth
	),
})
