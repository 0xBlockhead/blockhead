import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'

import type {
	EvmLocalSimulationInternalOperation,
	EvmLocalSimulationInternalOperations,
} from '$/actions/evmLocalSimulationInternalOperations.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { EvmAddress, EvmTopicHash, ZeroExHex } from '$/schema/ZeroExHex.ts'


const nativeValueCallTypes = new Set([
	'CALL',
	'CREATE',
	'CREATE2',
])

const eventTopic = (signature: string) => (
	EvmTopicHash.assert(Hash.keccak256(Hex.fromString(signature)))
)

export const erc20TransferTopic = eventTopic('Transfer(address,address,uint256)')
export const erc20ApprovalTopic = eventTopic('Approval(address,address,uint256)')

export type EvmLocalSimulationLog = {
	readonly logIndex: number
	readonly address: `0x${string}`
	readonly topics: readonly `0x${string}`[]
	readonly data: `0x${string}`
}

export type EvmLocalSimulationOperationFailure = (
	| { readonly kind: 'none' }
	| { readonly kind: 'local-revert'; readonly error: string }
	| {
		readonly kind: 'ancestor-revert'
		readonly ancestorCallPath: string
		readonly error: string
	}
)

export type EvmLocalSimulationOperationClassification = {
	readonly callPath: string
	readonly callType: EvmLocalSimulationInternalOperation['callType']
	readonly observed: EvmLocalSimulationInternalOperation['outcome']
	readonly stateCommitted: boolean
	readonly failure: EvmLocalSimulationOperationFailure
}

export type EvmLocalSimulationEffect = (
	| {
		readonly kind: 'native-value'
		readonly callPath: string
		readonly fromAddress?: `0x${string}`
		readonly toAddress?: `0x${string}`
		readonly value: bigint
		readonly committed: boolean
	}
	| {
		readonly kind: 'erc20-transfer'
		readonly logIndex: number
		readonly tokenAddress: `0x${string}`
		readonly fromAddress: `0x${string}`
		readonly toAddress: `0x${string}`
		readonly amount: bigint
		readonly committed: boolean
	}
	| {
		readonly kind: 'erc20-approval'
		readonly logIndex: number
		readonly tokenAddress: `0x${string}`
		readonly ownerAddress: `0x${string}`
		readonly spenderAddress: `0x${string}`
		readonly amount: bigint
		readonly committed: boolean
	}
)

export type EvmLocalSimulationEffects = {
	readonly source: EvmLocalSimulationInternalOperations['source']
	readonly chainId: number
	readonly stateBlockNumber: bigint
	readonly requestInputDataHash: `0x${string}`
	readonly operations: readonly EvmLocalSimulationOperationClassification[]
	readonly effects: readonly EvmLocalSimulationEffect[]
}

const addressFromIndexedTopic = (topic: `0x${string}` | undefined) => {
	if (topic == null || !/^0x0{24}[0-9a-f]{40}$/.test(topic))
		return undefined
	const address = hexLowerOfByteSize(`0x${topic.slice(-40)}`, 20)
	return address == null ? undefined : EvmAddress.assert(address)
}

const uint256FromWord = (hex: `0x${string}` | undefined) => (
	hex != null && /^0x[0-9a-f]{64}$/.test(hex) ?
		BigInt(hex)
	:
		undefined
)

const classifyOperations = (
	operations: readonly EvmLocalSimulationInternalOperation[]
): EvmLocalSimulationOperationClassification[] => {
	const committedByPath = new Map<string, boolean>()
	const failureByPath = new Map<string, EvmLocalSimulationOperationFailure>()

	return operations.map((operation) => {
		const parentCallPath = operation.parentCallPath
		const parentFailure = parentCallPath == null ? undefined : failureByPath.get(parentCallPath)
		const ancestorFailure = parentFailure?.kind === 'none' ? undefined : parentFailure
		const parentCommitted = parentCallPath == null || committedByPath.get(parentCallPath) === true
		const stateCommitted = parentCommitted && operation.outcome.kind === 'returned'
		const failure: EvmLocalSimulationOperationFailure = (
			ancestorFailure?.kind === 'local-revert' && parentCallPath != null ?
				{
					kind: 'ancestor-revert',
					ancestorCallPath: parentCallPath,
					error: ancestorFailure.error,
				}
			: ancestorFailure?.kind === 'ancestor-revert' ?
				ancestorFailure
			: operation.outcome.kind === 'reverted' ?
				{
					kind: 'local-revert',
					error: operation.outcome.error,
				}
			:
				{ kind: 'none' }
		)
		committedByPath.set(operation.callPath, stateCommitted)
		failureByPath.set(operation.callPath, failure)
		return {
			callPath: operation.callPath,
			callType: operation.callType,
			observed: operation.outcome,
			stateCommitted,
			failure,
		}
	})
}

const nativeEffects = (
	operations: readonly EvmLocalSimulationInternalOperation[],
	classifications: readonly EvmLocalSimulationOperationClassification[]
): EvmLocalSimulationEffect[] => (
	operations.flatMap((operation, index) => {
		if (!nativeValueCallTypes.has(operation.callType) || operation.value == null || operation.value === 0n)
			return []
		return [{
			kind: 'native-value' as const,
			callPath: operation.callPath,
			...(operation.fromAddress == null ? {} : { fromAddress: operation.fromAddress }),
			...(operation.toAddress == null ? {} : { toAddress: operation.toAddress }),
			value: operation.value,
			committed: classifications[index]?.stateCommitted === true,
		}]
	})
)

const tokenEffect = (
	log: EvmLocalSimulationLog,
	committed: boolean
): EvmLocalSimulationEffect | undefined => {
	const topics = log.topics.map((topic) => EvmTopicHash.assert(topic.toLowerCase()))
	const data = ZeroExHex.assert(log.data.toLowerCase())
	const tokenAddress = EvmAddress.assert(log.address.toLowerCase())
	if (topics.length !== 3)
		return undefined
	const amount = uint256FromWord(data)
	if (amount == null)
		return undefined
	if (topics[0] === erc20TransferTopic) {
		const fromAddress = addressFromIndexedTopic(topics[1])
		const toAddress = addressFromIndexedTopic(topics[2])
		if (fromAddress == null || toAddress == null)
			return undefined
		return {
			kind: 'erc20-transfer',
			logIndex: log.logIndex,
			tokenAddress,
			fromAddress,
			toAddress,
			amount,
			committed,
		}
	}
	if (topics[0] === erc20ApprovalTopic) {
		const ownerAddress = addressFromIndexedTopic(topics[1])
		const spenderAddress = addressFromIndexedTopic(topics[2])
		if (ownerAddress == null || spenderAddress == null)
			return undefined
		return {
			kind: 'erc20-approval',
			logIndex: log.logIndex,
			tokenAddress,
			ownerAddress,
			spenderAddress,
			amount,
			committed,
		}
	}
	return undefined
}

export const evmLocalSimulationEffects = (
	operations: EvmLocalSimulationInternalOperations,
	logs: readonly EvmLocalSimulationLog[] = []
): EvmLocalSimulationEffects => {
	const classifications = classifyOperations(operations.operations)
	const logsCommitted = classifications[0]?.stateCommitted === true
	return {
		source: operations.source,
		chainId: operations.chainId,
		stateBlockNumber: operations.stateBlockNumber,
		requestInputDataHash: operations.requestInputDataHash,
		operations: classifications,
		effects: [
			...nativeEffects(operations.operations, classifications),
			...logs.flatMap((log) => {
				const effect = tokenEffect(log, logsCommitted)
				return effect == null ? [] : [effect]
			}),
		],
	}
}
