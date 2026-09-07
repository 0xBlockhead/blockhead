export type EvmLocalSimulationCallFrame = {
	callType: 'CALL' | 'CALLCODE' | 'CREATE' | 'CREATE2' | 'DELEGATECALL' | 'STATICCALL'
	fromAddress?: `0x${string}`
	toAddress?: `0x${string}`
	value?: bigint
	inputDataHash?: `0x${string}`
	outputDataHash?: `0x${string}`
	gasUsed?: bigint
	outcome:
		| { kind: 'returned' }
		| { kind: 'reverted'; error: string }
	calls: readonly EvmLocalSimulationCallFrame[]
}

export type EvmLocalSimulationCallTrace = {
	source: {
		kind: 'anvil-local-call-trace'
		version: string
	}
	chainId: number
	stateBlockNumber: bigint
	requestInputDataHash: `0x${string}`
	root: EvmLocalSimulationCallFrame
}

export type EvmLocalSimulationInternalOperation = Omit<
	EvmLocalSimulationCallFrame,
	'calls'
> & {
	callPath: string
	parentCallPath?: string
	depth: number
	callIndex: number
}

export type EvmLocalSimulationInternalOperations = Pick<
	EvmLocalSimulationCallTrace,
	'source' | 'chainId' | 'stateBlockNumber' | 'requestInputDataHash'
> & {
	operations: readonly EvmLocalSimulationInternalOperation[]
}

export const evmLocalSimulationInternalOperations = (
	trace: EvmLocalSimulationCallTrace
): EvmLocalSimulationInternalOperations => {
	const operations: EvmLocalSimulationInternalOperation[] = []

	const visit = (
		frame: EvmLocalSimulationCallFrame,
		callPath: string,
		parentCallPath: string | undefined,
		depth: number,
		callIndex: number
	) => {
		const { calls, ...operation } = frame
		operations.push({
			...operation,
			callPath,
			...(parentCallPath === undefined ? {} : { parentCallPath }),
			depth,
			callIndex,
		})
		calls.forEach((child, childIndex) => visit(
			child,
			`${callPath}.${childIndex}`,
			callPath,
			depth + 1,
			childIndex
		))
	}

	visit(trace.root, '0', undefined, 0, 0)

	return {
		source: trace.source,
		chainId: trace.chainId,
		stateBlockNumber: trace.stateBlockNumber,
		requestInputDataHash: trace.requestInputDataHash,
		operations,
	}
}
