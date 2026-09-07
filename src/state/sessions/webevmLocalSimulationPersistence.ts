import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'

import { writeLocalBlockheadSessionSimulation } from '$/collections/localMutations.ts'
import type { LocalMutationContext } from '$/collections/localMutations.ts'
import { EvmAddress, EvmTopicHash, Hash32, ZeroExHex } from '$/schema/ZeroExHex.ts'

type LocalMutationArguments = Parameters<typeof writeLocalBlockheadSessionSimulation>
type Simulation = LocalMutationArguments[2]
type SimulationCall = NonNullable<LocalMutationArguments[3]>[number]
type SimulationLog = NonNullable<LocalMutationArguments[4]>[number]

export type WebEvmHex = `0x${string}`

export type WebEvmRequest = {
	readonly from?: WebEvmHex
	readonly to?: WebEvmHex | null
	readonly value?: WebEvmHex | bigint
	readonly input?: WebEvmHex
}

export type WebEvmCallSuccess = {
	readonly kind: 'success'
	readonly data: WebEvmHex
	readonly gasUsed?: bigint
}

export type WebEvmCallRevert = {
	readonly kind: 'revert'
	readonly data: WebEvmHex
	readonly gasUsed?: bigint
}

export type WebEvmCallResult = WebEvmCallSuccess | WebEvmCallRevert

export type WebEvmLog = {
	readonly address: WebEvmHex
	readonly topics: readonly WebEvmHex[]
	readonly data: WebEvmHex
}

export type WebEvmReceipt = {
	readonly status: '0x1' | '0x0'
	readonly gasUsed: WebEvmHex
	readonly logs: readonly WebEvmLog[]
}

export type WebEvmSimulationBase = {
	readonly id: string
	readonly createdAt: number
	readonly completedAt: number
	readonly paramsHash: WebEvmHex
	readonly forkBlockNumber?: bigint
	readonly resultPayloadHash?: WebEvmHex
}

export type WebEvmSimulationInput = {
	readonly session: LocalMutationArguments[1]
	readonly simulation: WebEvmSimulationBase
	readonly request: WebEvmRequest
} & (
	| { readonly kind: 'call'; readonly call: WebEvmCallResult }
	| { readonly kind: 'receipt'; readonly receipt: WebEvmReceipt }
)

const sha256Text = (value: string): WebEvmHex =>
	Hash32.assert(Hash.sha256(Hex.fromString(value)))

const normalizeValue = (
	value: WebEvmRequest['value']
): bigint | undefined => {
	if (value == null) return undefined
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- WebEVM 0.5 exposes this wire field as bigint | hex.
	if (typeof value === 'bigint') return value
	return Hex.toBigInt(ZeroExHex.assert(value))
}

const normalizeGasUsed = (value: WebEvmHex | bigint): bigint =>
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- WebEVM 0.5 call and receipt results use distinct bigint and hex wire forms.
	typeof value === 'bigint' ? value : Hex.toBigInt(value)

const inputSelector = (input: WebEvmHex): WebEvmHex | undefined =>
	input.length >= 10 ? ZeroExHex.assert(input.slice(0, 10)) : undefined

const rootCall = (
	request: WebEvmRequest,
	{
		reverted,
		error,
		outputDataHash,
		gasUsed,
	}: {
		reverted: boolean
		error?: string
		outputDataHash?: WebEvmHex
		gasUsed?: bigint
	}
): SimulationCall => {
	const input = ZeroExHex.assert(request.input ?? '0x')
	const value = normalizeValue(request.value)
	const fromAddress = request.from != null ? EvmAddress.assert(request.from) : undefined
	const toAddress = request.to != null ? EvmAddress.assert(request.to) : undefined

	return {
		callPath: 'root',
		depth: 0,
		callIndex: 0,
		callType: request.to == null ? 'CREATE' : 'CALL',
		reverted,
		...(fromAddress != null && { fromAddress }),
		...(toAddress != null && { toAddress }),
		...(value != null && { value }),
		...(inputSelector(input) != null && { inputSelector: inputSelector(input) }),
		inputDataHash: Hash.sha256(input),
		...(outputDataHash != null && { outputDataHash }),
		...(gasUsed != null && { gasUsed }),
		...(error != null && { error }),
	}
}

const simulationLog = (log: WebEvmLog, logIndex: number): SimulationLog => {
	const topics = log.topics.map((topic) => EvmTopicHash.assert(topic))

	return {
		logIndex,
		address: EvmAddress.assert(log.address),
		...(topics[0] != null && { topic0: topics[0] }),
		topics,
		dataHash: Hash.sha256(log.data),
		removed: false,
	}
}

const callResultPayloadHash = (
	call: WebEvmCallSuccess | WebEvmCallRevert,
	baseResultPayloadHash: WebEvmHex | undefined
): WebEvmHex | undefined => {
	if (baseResultPayloadHash != null) return Hash32.assert(baseResultPayloadHash)
	return sha256Text(JSON.stringify([
		call.kind,
		call.data,
		call.gasUsed?.toString() ?? null,
	]))
}

const receiptResultPayloadHash = (
	receipt: WebEvmReceipt,
	baseResultPayloadHash: WebEvmHex | undefined
): WebEvmHex | undefined => {
	if (baseResultPayloadHash != null) return Hash32.assert(baseResultPayloadHash)
	return sha256Text(JSON.stringify([
		receipt.status,
		receipt.gasUsed,
		receipt.logs.map((log) => [log.address, [...log.topics], log.data]),
	]))
}

export const webEvmSimulationInput = (
	input: WebEvmSimulationInput
): {
	session: LocalMutationArguments[1]
	simulation: Simulation
	calls: readonly SimulationCall[]
	logs: readonly SimulationLog[]
} => {
	const { session, simulation: base, request } = input
	if (base.completedAt < base.createdAt)
		throw new Error('WebEVM simulation completion must not precede creation')
	const commonSimulation = {
		id: base.id,
		createdAt: base.createdAt,
		completedAt: base.completedAt,
		paramsHash: Hash32.assert(base.paramsHash),
		actionCount: 1,
		...(base.forkBlockNumber != null && { forkBlockNumber: base.forkBlockNumber }),
	}

	if (input.kind === 'receipt') {
		const { receipt } = input
		const reverted = receipt.status === '0x0'
		const status = reverted ? 'failed' : 'succeeded'
		const error = reverted ? 'transaction reverted' : undefined
		const gasUsed = normalizeGasUsed(receipt.gasUsed)

		const resultPayloadHash = receiptResultPayloadHash(receipt, base.resultPayloadHash)
		const simulation: Simulation = {
			...commonSimulation,
			status,
			gasUsed,
			...(resultPayloadHash != null && { resultPayloadHash }),
			...(error != null && { error }),
		}

		const call = rootCall(request, { reverted, error, gasUsed })

		return {
			session,
			simulation,
			calls: [call],
			logs: receipt.logs.map(simulationLog),
		}
	}

	const { call } = input

	if (call.kind === 'revert') {
		const outputDataHash = Hash.sha256(call.data)
		const resultPayloadHash = callResultPayloadHash(call, base.resultPayloadHash)
		const error = 'execution reverted'

		const simulation: Simulation = {
			...commonSimulation,
			status: 'failed',
			...(call.gasUsed != null && { gasUsed: call.gasUsed }),
			resultPayloadHash,
			error,
		}

		const callRow = rootCall(request, {
			reverted: true,
			error,
			outputDataHash,
			gasUsed: call.gasUsed,
		})

		return { session, simulation, calls: [callRow], logs: [] }
	}

	const outputDataHash = Hash.sha256(call.data)
	const resultPayloadHash = callResultPayloadHash(call, base.resultPayloadHash)

	const simulation: Simulation = {
		...commonSimulation,
		status: 'succeeded',
		...(call.gasUsed != null && { gasUsed: call.gasUsed }),
		...(resultPayloadHash != null && { resultPayloadHash }),
	}

	const callRow = rootCall(request, {
		reverted: false,
		outputDataHash,
		gasUsed: call.gasUsed,
	})

	return { session, simulation, calls: [callRow], logs: [] }
}

export const persistWebEvmSimulation = async (
	context: LocalMutationContext,
	input: WebEvmSimulationInput
) => {
	const { session, simulation, calls, logs } = webEvmSimulationInput(input)
	await writeLocalBlockheadSessionSimulation(context, session, simulation, calls, logs)
}
