import * as Hash from 'ox/Hash'

import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntityFieldValue,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { schema } from '$/schema/index.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { writeLocalBlockheadSessionSimulation } from '$/collections/localMutations.ts'

const traceIndexField = entityFieldAddressKey(EntityType.EvmTrace, [], 'index')
const traceTypeField = entityFieldAddressKey(EntityType.EvmTrace, [], 'type')
const traceFromField = entityFieldAddressKey(EntityType.EvmTrace, [], '$from')
const traceToField = entityFieldAddressKey(EntityType.EvmTrace, [], '$to')
const traceValueField = entityFieldAddressKey(EntityType.EvmTrace, [], 'value')
const traceInputField = entityFieldAddressKey(EntityType.EvmTrace, [], 'input')
const traceOutputField = entityFieldAddressKey(EntityType.EvmTrace, [], 'output')
const traceGasUsedField = entityFieldAddressKey(EntityType.EvmTrace, [], 'gasUsed')
const traceErrorField = entityFieldAddressKey(EntityType.EvmTrace, [], 'error')
const logTopicsField = entityFieldAddressKey(EntityType.EvmLog, [], '$$topics')
const logTopic0Field = entityFieldAddressKey(EntityType.EvmLog, [], 'topic0')
const logDataField = entityFieldAddressKey(EntityType.EvmLog, [], 'data')
const logRemovedField = entityFieldAddressKey(EntityType.EvmLog, [], 'removed')
const logEmitterField = entityFieldAddressKey(EntityType.EvmLog, [], '$emitter')

export type VoltaireTraceProjectionRow = {
	readonly [EntityMetaKey.Selector]: { readonly traceAddress: string }
	readonly [EntityMetaKey.Fields]: {
		readonly [traceIndexField]?: EntityFieldValue<typeof schema, EntityType.EvmTrace, 'index'>
		readonly [traceTypeField]?: EntityFieldValue<typeof schema, EntityType.EvmTrace, 'type'>
		readonly [traceFromField]?: EntityFieldValue<typeof schema, EntityType.EvmTrace, '$from'>
		readonly [traceToField]?: EntityFieldValue<typeof schema, EntityType.EvmTrace, '$to'>
		readonly [traceValueField]?: EntityFieldValue<typeof schema, EntityType.EvmTrace, 'value'>
		readonly [traceInputField]?: EntityFieldValue<typeof schema, EntityType.EvmTrace, 'input'>
		readonly [traceOutputField]?: EntityFieldValue<typeof schema, EntityType.EvmTrace, 'output'>
		readonly [traceGasUsedField]?: EntityFieldValue<typeof schema, EntityType.EvmTrace, 'gasUsed'>
		readonly [traceErrorField]?: EntityFieldValue<typeof schema, EntityType.EvmTrace, 'error'>
	}
}

export type VoltaireLogProjectionRow = {
	readonly [EntityMetaKey.Selector]: { readonly indexInTransaction: number }
	readonly [EntityMetaKey.Fields]: {
		readonly [logTopicsField]?: EntityFieldValue<typeof schema, EntityType.EvmLog, '$$topics'>
		readonly [logTopic0Field]?: EntityFieldValue<typeof schema, EntityType.EvmLog, 'topic0'>
		readonly [logDataField]?: EntityFieldValue<typeof schema, EntityType.EvmLog, 'data'>
		readonly [logRemovedField]?: EntityFieldValue<typeof schema, EntityType.EvmLog, 'removed'>
		readonly [logEmitterField]?: EntityFieldValue<typeof schema, EntityType.EvmLog, '$emitter'>
	}
}

type LocalMutationArguments = Parameters<typeof writeLocalBlockheadSessionSimulation>
type SimulationCall = NonNullable<LocalMutationArguments[3]>[number]
type SimulationLog = NonNullable<LocalMutationArguments[4]>[number]

export type VoltaireSimulationPersistenceInput = {
	readonly session: LocalMutationArguments[1]
	readonly simulation: LocalMutationArguments[2]
	readonly traces: readonly VoltaireTraceProjectionRow[]
	readonly logs: readonly VoltaireLogProjectionRow[]
}

const tracePosition = (callPath: string) => {
	if (callPath === 'root') return { callIndex: 0, depth: 0 }
	if (!/^(0|[1-9]\d*)(\.(0|[1-9]\d*))*$/.test(callPath))
		throw new Error(`Invalid Voltaire resolver trace path: ${callPath}`)
	const segments = callPath.split('.')
	return {
		callIndex: Number(segments.at(-1)),
		depth: segments.length,
		parentCallPath: segments.length === 1 ? 'root' : segments.slice(0, -1).join('.'),
	}
}

const requireUnique = (values: readonly (number | string)[], message: string) => {
	if (values.length !== new Set(values).size) throw new Error(message)
}

const requireTraceParents = (tracePaths: readonly string[]) => {
	const paths = new Set(tracePaths)
	for (const tracePath of tracePaths) {
		const position = tracePosition(tracePath)
		if (position.parentCallPath != null && !paths.has(position.parentCallPath))
			throw new Error(`Voltaire resolver trace parent is missing: ${tracePath}`)
	}
}

export const voltaireSimulationMutationInputFromProjectionRows = ({
	traces,
	logs,
}: Pick<VoltaireSimulationPersistenceInput, 'traces' | 'logs'>): {
	calls: SimulationCall[]
	logs: SimulationLog[]
} => {
	const tracePaths = traces.map((trace) => trace[EntityMetaKey.Selector].traceAddress)
	requireUnique(tracePaths, 'Voltaire resolver trace paths must be unique')
	requireTraceParents(tracePaths)
	requireUnique(logs.map((log) => log[EntityMetaKey.Selector].indexInTransaction), 'Voltaire resolver receipt log indexes must be unique')

	return {
		calls: traces.map((trace) => {
			const callPath = trace[EntityMetaKey.Selector].traceAddress
			const position = tracePosition(callPath)
			const fields = trace[EntityMetaKey.Fields]
			const resolverIndex = fields[traceIndexField]
			const callType = fields[traceTypeField]
			if (resolverIndex == null || resolverIndex !== position.callIndex)
				throw new Error(`Voltaire resolver trace index does not match path: ${callPath}`)
			if (callType == null) throw new Error(`Voltaire resolver trace type is missing: ${callPath}`)
			const from = fields[traceFromField]
			const to = fields[traceToField]
			const input = fields[traceInputField]
			const output = fields[traceOutputField]
			const error = fields[traceErrorField]

			return {
				callPath,
				...position,
				callType,
				...(from != null && { fromAddress: from[EntityMetaKey.Selector].address }),
				...(to != null && { toAddress: to[EntityMetaKey.Selector].address }),
				...(fields[traceValueField] != null && { value: fields[traceValueField] }),
				...(input != null && {
					...(input.length >= 10 && { inputSelector: ZeroExHex.assert(input.slice(0, 10)) }),
					inputDataHash: Hash.sha256(input),
				}),
				...(output != null && { outputDataHash: Hash.sha256(output) }),
				...(fields[traceGasUsedField] != null && { gasUsed: fields[traceGasUsedField] }),
				...(error != null && { error, reverted: true }),
			} satisfies SimulationCall
		}),
		logs: logs.map((log) => {
			const fields = log[EntityMetaKey.Fields]
			const topicReferences = fields[logTopicsField]
			if (topicReferences == null) throw new Error(`Voltaire resolver log topics are missing: ${log[EntityMetaKey.Selector].indexInTransaction}`)
			const topics = topicReferences.map((topic) => topic[EntityMetaKey.Selector].hex)
			const projectedTopic0 = fields[logTopic0Field]
			if (projectedTopic0 != null && projectedTopic0 !== topics[0])
				throw new Error(`Voltaire resolver log topic0 does not match topics[0]: ${log[EntityMetaKey.Selector].indexInTransaction}`)
			const topic0 = projectedTopic0 ?? topics[0]
			const data = fields[logDataField]
			const emitter = fields[logEmitterField]

			return {
				logIndex: log[EntityMetaKey.Selector].indexInTransaction,
				...(emitter != null && { address: emitter[EntityMetaKey.Selector].address }),
				...(topic0 != null && { topic0 }),
				topics,
				...(data != null && { dataHash: Hash.sha256(data) }),
				...(fields[logRemovedField] != null && { removed: fields[logRemovedField] }),
			} satisfies SimulationLog
		}),
	}
}

export const persistVoltaireSimulation = async (
	context: LocalMutationArguments[0],
	input: VoltaireSimulationPersistenceInput
) => {
	const { calls, logs } = voltaireSimulationMutationInputFromProjectionRows(input)
	await writeLocalBlockheadSessionSimulation(context, input.session, input.simulation, calls, logs)
}
