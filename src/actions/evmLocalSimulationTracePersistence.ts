import {
	type LocalMutationContext,
	writeLocalBlockheadSessionSimulation,
} from '$/collections/localMutations.ts'

import type {
	EvmLocalSimulationInternalOperation,
	EvmLocalSimulationInternalOperations,
} from '$/actions/evmLocalSimulationInternalOperations.ts'
import type { EvmLocalSimulationTraceAcquisition } from '$/actions/evmLocalSimulationTraceAcquisition.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'

type LocalMutationArguments = Parameters<typeof writeLocalBlockheadSessionSimulation>
type SimulationCall = NonNullable<LocalMutationArguments[3]>[number]

export type AnvilLocalSimulationPersistenceInput = {
	readonly session: LocalMutationArguments[1]
	readonly simulation: LocalMutationArguments[2]
	readonly acquisition: EvmLocalSimulationTraceAcquisition
}

const operationPosition = (callPath: string) => {
	if (!/^(0|[1-9]\d*)(\.(0|[1-9]\d*))*$/.test(callPath))
		throw new Error(`Anvil operation path is invalid: ${callPath}`)
	const segments = callPath.split('.')
	return {
		callIndex: Number(segments.at(-1)),
		depth: segments.length - 1,
		parentCallPath: segments.length === 1 ? undefined : segments.slice(0, -1).join('.'),
	}
}

const requireOperationGraph = (operations: EvmLocalSimulationInternalOperations) => {
	if (operations.operations.length === 0)
		throw new Error('Anvil operation graph is empty.')
	const paths = new Set<string>()
	for (const [index, operation] of operations.operations.entries()) {
		if (paths.has(operation.callPath))
			throw new Error(`Anvil operation paths must be unique: ${operation.callPath}`)
		paths.add(operation.callPath)
		const position = operationPosition(operation.callPath)
		if (
			operation.callIndex !== position.callIndex
			|| operation.depth !== position.depth
			|| operation.parentCallPath !== position.parentCallPath
		)
			throw new Error(`Anvil operation position does not match path: ${operation.callPath}`)
		if (index === 0 && operation.callPath !== '0')
			throw new Error('Anvil operation graph root must be path 0.')
		if (
			index > 0
			&& (
				operation.parentCallPath == null
				|| !paths.has(operation.parentCallPath)
			)
		)
			throw new Error(`Anvil operation parent must precede child: ${operation.callPath}`)
	}
}

const requireBinding = (
	input: AnvilLocalSimulationPersistenceInput,
	operations: EvmLocalSimulationInternalOperations,
	trace: Extract<EvmLocalSimulationTraceAcquisition, { kind: 'acquired' }>['trace']
) => {
	if (operations.source.kind !== 'anvil-local-call-trace')
		throw new Error('Anvil persistence requires an Anvil local call trace.')
	if (
		trace.source.kind !== operations.source.kind
		|| trace.source.version !== operations.source.version
		|| trace.chainId !== operations.chainId
		|| trace.stateBlockNumber !== operations.stateBlockNumber
		|| trace.requestInputDataHash !== operations.requestInputDataHash
	)
		throw new Error('Anvil trace and normalized operations lost their identity binding.')
	if (input.simulation.paramsHash !== operations.requestInputDataHash)
		throw new Error('Anvil simulation params hash does not match the request input.')
	if (input.simulation.forkBlockNumber !== operations.stateBlockNumber)
		throw new Error('Anvil simulation fork block does not match the trace state block.')
}

const simulationCallFromOperation = (
	{ outcome, ...operation }: EvmLocalSimulationInternalOperation
): SimulationCall => ({
	...operation,
	...(outcome.kind === 'reverted' && {
		reverted: true,
		error: outcome.error,
	}),
})

export const anvilSimulationMutationInputFromOperations = (
	operations: EvmLocalSimulationInternalOperations
): SimulationCall[] => {
	requireOperationGraph(operations)
	return operations.operations.map(simulationCallFromOperation)
}

export const persistAnvilLocalSimulation = async (
	context: LocalMutationContext,
	input: AnvilLocalSimulationPersistenceInput
) => {
	if (input.acquisition.kind !== 'acquired')
		throw new Error(`Anvil trace acquisition failed before persistence: ${input.acquisition.error}`)
	const { operations } = input.acquisition
	requireBinding(input, operations, input.acquisition.trace)
	const calls = anvilSimulationMutationInputFromOperations(operations)
	const entitySelector = await writeLocalBlockheadSessionSimulation(
		context,
		input.session,
		{
			...input.simulation,
			executionSourceKind: operations.source.kind,
			executionSourceVersion: operations.source.version,
			$executionNetwork: {
				[EntityMetaKey.Selector]: {
					caip2: {
						namespace: 'eip155',
						reference: String(operations.chainId),
					},
				},
			},
		},
		calls,
		[]
	)
	return {
		entitySelector,
		source: operations.source,
		chainId: operations.chainId,
		stateBlockNumber: operations.stateBlockNumber,
		requestInputDataHash: operations.requestInputDataHash,
	}
}
