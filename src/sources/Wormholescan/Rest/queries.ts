import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Wormholescan/bindings.ts'
import type { operations } from '$/sources/Wormholescan/OpenApi/openapi.d.ts'
import type {
	WormholescanOperation,
	WormholescanOperationsPage,
	WormholescanVaa,
	WormholescanVaaByIdResponse,
} from '$/sources/Wormholescan/Rest/types.ts'
import {
	wormholescanOperationEnvelope,
	wormholescanOperationsPageEnvelope,
	wormholescanVaaByIdResponseEnvelope,
} from '$/sources/Wormholescan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Wormholescan][0]
const integerStringPattern = /^(?:0|[1-9]\d*)$/
const emitterAddressPattern = /^[0-9a-fA-F]{1,128}$/
const operationSequencePattern = /^[0-9a-fA-F]+(?:-\d+)?$/

const omitUndefinedJson = (
	value: unknown
): unknown => {
	if (Array.isArray(value))
		return value.map(omitUndefinedJson)
	if (value != null && typeof value === 'object')
		return Object.fromEntries(
			Object.entries(value as Record<string, unknown>)
				.filter(([, entry]) => entry !== undefined)
				.map(([key, entry]) => [
					key,
					omitUndefinedJson(entry),
				])
		)
	return value
}

const assertEnvelope = <_Value>(
	envelope: {
		assert: (value: unknown) => unknown
	},
	value: unknown,
	label: string
) => {
	try {
		envelope.assert(omitUndefinedJson(value))
	} catch {
		throw new Error(`Wormholescan_Rest: invalid ${label} response envelope`)
	}
	return value as _Value
}

const queryString = (
	parameters: Record<string, string | number | boolean | undefined>
) => {
	const searchParameters = new URLSearchParams(
		Object.entries(parameters).flatMap(([name, value]) => (
			value == null ? [] : [[name, String(value)]]
		))
	)

	return searchParameters.size === 0 ? '' : `?${searchParameters}`
}

const assertWormholeChainId = (chainId: number) => {
	if (!Number.isSafeInteger(chainId) || chainId < 0)
		throw new Error(`Wormholescan_Rest: invalid wormhole chain id ${chainId}`)
}

const assertEmitterAddress = (emitter: string) => {
	if (!emitterAddressPattern.test(emitter))
		throw new Error(`Wormholescan_Rest: invalid emitter address ${emitter}`)
}

const assertSequence = (sequence: number | string) => {
	if (
		!integerStringPattern.test(String(sequence))
		|| !Number.isSafeInteger(Number(sequence))
	)
		throw new Error(`Wormholescan_Rest: invalid VAA sequence ${sequence}`)
}

const assertOperationSequence = (sequence: number | string) => {
	if (!operationSequencePattern.test(String(sequence)))
		throw new Error(`Wormholescan_Rest: invalid operation sequence ${sequence}`)
}

const assertOperation = (
	operation: WormholescanOperation,
	request?: {
		chainId: number
		emitter: string
		sequence: number | string
	}
) => {
	assertEnvelope(wormholescanOperationEnvelope, operation, 'operation')
	assertWormholeChainId(operation.emitterChain)
	assertEmitterAddress(operation.emitterAddress.hex)
	assertOperationSequence(operation.sequence)
	if (operation.id !== `${operation.emitterChain}/${operation.emitterAddress.hex}/${operation.sequence}`)
		throw new Error(`Wormholescan_Rest: mismatched operation id ${operation.id}`)
	if (
		request != null
		&& (
			operation.emitterChain !== request.chainId
			|| operation.emitterAddress.hex.toLowerCase() !== request.emitter.toLowerCase()
			|| operation.sequence !== String(request.sequence)
		)
	)
		throw new Error(`Wormholescan_Rest: mismatched operation id ${operation.id}`)

	return operation
}

const operationsFromPage = (
	page: unknown,
	path: string
) => {
	const operationsPage = assertEnvelope<WormholescanOperationsPage>(
		wormholescanOperationsPageEnvelope,
		page,
		path
	)

	const operations = operationsPage.operations.map((operation) => (
		assertOperation(operation)
	))
	if (new Set(operations.map(({ id }) => id)).size !== operations.length)
		throw new Error('Wormholescan_Rest: operations page contains duplicate identities')
	return operations
}

const assertVaa = (
	vaa: WormholescanVaa,
	{
		chainId,
		emitter,
		sequence,
	}: {
		chainId: number
		emitter: string
		sequence: number | string
	}
) => {
	assertWormholeChainId(vaa.emitterChain)
	assertEmitterAddress(vaa.emitterAddr)
	assertSequence(vaa.sequence)
	if (vaa.timestamp === '' || !Number.isFinite(Date.parse(vaa.timestamp)))
		throw new Error(`Wormholescan_Rest: invalid VAA timestamp ${vaa.timestamp}`)
	if (
		(
			typeof vaa.vaa === 'string'
			&& vaa.vaa.length < 1
		)
		|| (
			Array.isArray(vaa.vaa)
			&& vaa.vaa.length < 1
		)
	)
		throw new Error('Wormholescan_Rest: VAA missing bytes')
	if (
		vaa.emitterChain !== chainId
		|| vaa.emitterAddr.toLowerCase() !== emitter.toLowerCase()
		|| String(vaa.sequence) !== String(sequence)
	)
		throw new Error('Wormholescan_Rest: mismatched VAA identity')
	if (vaa.id !== `${chainId}/${vaa.emitterAddr}/${vaa.sequence}`)
		throw new Error(`Wormholescan_Rest: mismatched VAA id ${vaa.id}`)
}

export const getHealth = () => (
	getJson<operations['health-check']['responses'][200]['content']['*/*']>(
		binding,
		'health'
	)
)

export const getReady = () => (
	getJson<operations['ready-check']['responses'][200]['content']['*/*']>(
		binding,
		'ready'
	)
)

export const getOperations = async (
	parameters: NonNullable<operations['get-operations']['parameters']['query']> = {}
) => {
	if (parameters.page != null && (!Number.isSafeInteger(parameters.page) || parameters.page < 0))
		throw new Error(`Wormholescan_Rest: invalid operations page ${parameters.page}`)
	if (parameters.pageSize != null && (!Number.isSafeInteger(parameters.pageSize) || parameters.pageSize < 1))
		throw new Error(`Wormholescan_Rest: invalid operations page size ${parameters.pageSize}`)
	if (parameters.minAmount != null && (!Number.isFinite(parameters.minAmount) || parameters.minAmount < 0))
		throw new Error(`Wormholescan_Rest: invalid operations minimum amount ${parameters.minAmount}`)

	return operationsFromPage(
		await getJson(
			binding,
			`operations${queryString(parameters)}`
		),
		'operations'
	)
}

export const getOperationById = async (
	{
		chainId,
		emitter,
		sequence,
	}: {
		chainId: number
		emitter: string
		sequence: number | string
	}
) => {
	assertWormholeChainId(chainId)
	assertEmitterAddress(emitter)
	assertOperationSequence(sequence)

	return assertOperation(
		await getJson(
			binding,
			`operations/${chainId}/${encodeURIComponent(emitter)}/${sequence}`
		),
		{
			chainId,
			emitter,
			sequence,
		}
	)
}

export const findGlobalTransactionById = (
	{
		chainId,
		emitter,
		sequence,
	}: {
		chainId: number
		emitter: string
		sequence: number | string
	}
) => {
	assertWormholeChainId(chainId)
	assertEmitterAddress(emitter)
	assertSequence(sequence)

	return getJson<operations['find-global-transaction-by-id']['responses'][200]['content']['*/*']>(
		binding,
		`global-tx/${chainId}/${encodeURIComponent(emitter)}/${sequence}`
	)
}

export const getVaaById = async (
	{
		chainId,
		emitter,
		sequence,
		parsedPayload,
	}: {
		chainId: number
		emitter: string
		sequence: number | string
		parsedPayload?: boolean
	}
) => {
	assertWormholeChainId(chainId)
	assertEmitterAddress(emitter)
	assertSequence(sequence)

	const page = assertEnvelope<WormholescanVaaByIdResponse>(
		wormholescanVaaByIdResponseEnvelope,
		await getJson(
			binding,
			`vaas/${chainId}/${encodeURIComponent(emitter)}/${sequence}${queryString({ parsedPayload })}`
		),
		'VAA'
	)

	assertVaa(page.data, {
		chainId,
		emitter,
		sequence,
	})

	return page.data
}
