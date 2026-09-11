import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'

import {
	evmLocalSimulationInternalOperations,
	type EvmLocalSimulationCallFrame,
	type EvmLocalSimulationCallTrace,
	type EvmLocalSimulationInternalOperations,
} from '$/actions/evmLocalSimulationInternalOperations.ts'
import { EvmAddress, Hash32, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { isJsonArray, isJsonObject, isJsonString, type JsonValue } from '$/typescript/JsonValue.ts'


export type EvmLocalSimulationTraceCall = {
	rpc: (
		method: 'web3_clientVersion' | 'eth_chainId' | 'debug_traceCall',
		params: readonly JsonValue[]
	) => Promise<JsonValue>
	chainId: number
	stateBlockNumber: bigint
	from: `0x${string}`
	to: `0x${string}`
	input: `0x${string}`
	value: bigint
}

export type EvmLocalSimulationTraceAcquisition = (
	| {
		kind: 'acquired'
		trace: EvmLocalSimulationCallTrace
		operations: EvmLocalSimulationInternalOperations
	}
	| {
		kind: 'failed'
		error: string
	}
)

const hexQuantity = (value: JsonValue | undefined, label: string) => {
	if (!isJsonString(value) || !/^0x[0-9a-f]+$/i.test(value))
		throw new Error(`${label} must be a hexadecimal quantity.`)

	return BigInt(value)
}

const optionalHexQuantity = (value: JsonValue | undefined, label: string) => (
	value == null ? undefined : hexQuantity(value, label)
)

const optionalHex = (value: JsonValue | undefined, label: string) => {
	if (value == null) return undefined
	if (!isJsonString(value))
		throw new Error(`${label} must be hexadecimal data.`)

	return ZeroExHex.assert(value)
}

const optionalAddress = (value: JsonValue | undefined, label: string) => {
	if (value == null) return undefined
	if (!isJsonString(value))
		throw new Error(`${label} must be an EVM address.`)

	return EvmAddress.assert(value.toLowerCase())
}

const dataHash = (value: `0x${string}`) => Hash32.assert(Hash.sha256(value))

const requestInputDataHash = (call: EvmLocalSimulationTraceCall) => (
	Hash32.assert(Hash.sha256(Hex.fromString(JSON.stringify({
		from: call.from.toLowerCase(),
		to: call.to.toLowerCase(),
		input: call.input.toLowerCase(),
		value: `0x${call.value.toString(16)}`,
		blockTag: `0x${call.stateBlockNumber.toString(16)}`,
	}))))
)

const callType = (value: JsonValue | undefined): EvmLocalSimulationCallFrame['callType'] => {
	if (!isJsonString(value))
		throw new Error('Anvil call trace frame is missing type.')
	switch (value) {
		case 'CALL':
		case 'CALLCODE':
		case 'CREATE':
		case 'CREATE2':
		case 'DELEGATECALL':
		case 'STATICCALL':
			return value
		default:
			throw new Error(`Unsupported Anvil call trace type: ${value}`)
	}
}

const parseFrame = (value: JsonValue): EvmLocalSimulationCallFrame => {
	if (!isJsonObject(value))
		throw new Error('Anvil call trace frame must be an object.')

	const input = optionalHex(value.input, 'Anvil call trace input')
	const output = optionalHex(value.output, 'Anvil call trace output')
	const error = value.error ?? value.revertReason
	if (error != null && !isJsonString(error))
		throw new Error('Anvil call trace error must be a string.')

	const calls = value.calls == null ? [] : value.calls
	if (!isJsonArray(calls))
		throw new Error('Anvil call trace calls must be an array.')
	const fromAddress = optionalAddress(value.from, 'Anvil call trace from')
	const toAddress = optionalAddress(value.to, 'Anvil call trace to')
	const frameValue = optionalHexQuantity(value.value, 'Anvil call trace value')
	const gasUsed = optionalHexQuantity(value.gasUsed, 'Anvil call trace gasUsed')

	return {
		callType: callType(value.type),
		...(fromAddress == null ? {} : { fromAddress }),
		...(toAddress == null ? {} : { toAddress }),
		...(frameValue == null ? {} : { value: frameValue }),
		...(input == null ? {} : { inputDataHash: dataHash(input) }),
		...(output == null ? {} : { outputDataHash: dataHash(output) }),
		...(gasUsed == null ? {} : { gasUsed }),
		outcome: error == null ? { kind: 'returned' } : { kind: 'reverted', error },
		calls: calls.map(parseFrame),
	}
}

export const acquireEvmLocalSimulationCallTrace = async (
	call: EvmLocalSimulationTraceCall
): Promise<EvmLocalSimulationTraceAcquisition> => {
	try {
		if (!Number.isSafeInteger(call.chainId) || call.chainId <= 0)
			throw new Error('Anvil trace acquisition requires a positive safe chain ID.')
		if (call.stateBlockNumber < 0n)
			throw new Error('Anvil trace acquisition requires a non-negative state block.')
		if (call.value < 0n)
			throw new Error('Anvil trace acquisition requires a non-negative call value.')

		const clientVersion = call.rpc('web3_clientVersion', [])
		const chainId = call.rpc('eth_chainId', [])
		const [clientVersionValue, chainIdValue] = await Promise.all([clientVersion, chainId])
		if (!isJsonString(clientVersionValue) || !clientVersionValue.startsWith('anvil/'))
			throw new Error('Anvil trace acquisition requires an Anvil client version.')
		if (hexQuantity(chainIdValue, 'Anvil chain ID') !== BigInt(call.chainId))
			throw new Error('Anvil chain ID did not match the requested chain ID.')

		const blockTag = `0x${call.stateBlockNumber.toString(16)}`
		const traceValue = await call.rpc('debug_traceCall', [{
			from: call.from.toLowerCase(),
			to: call.to.toLowerCase(),
			data: call.input.toLowerCase(),
			value: `0x${call.value.toString(16)}`,
		}, blockTag, { tracer: 'callTracer' }])
		const trace: EvmLocalSimulationCallTrace = {
			source: {
				kind: 'anvil-local-call-trace',
				version: clientVersionValue,
			},
			chainId: call.chainId,
			stateBlockNumber: call.stateBlockNumber,
			requestInputDataHash: requestInputDataHash(call),
			root: parseFrame(traceValue),
		}

		return {
			kind: 'acquired',
			trace,
			operations: evmLocalSimulationInternalOperations(trace),
		}
	}
	catch (error) {
		return {
			kind: 'failed',
			error: error instanceof Error ? error.message : 'Anvil trace acquisition failed.',
		}
	}
}
