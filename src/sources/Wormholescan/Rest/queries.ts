import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Wormholescan/bindings.ts'
import type { operations } from '$/sources/Wormholescan/OpenApi/openapi.d.ts'
import type {
	WormholescanOperation,
	WormholescanOperationsPage,
	WormholescanVaa,
	WormholescanVaaByIdResponse,
} from '$/sources/Wormholescan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Wormholescan][0]
const integerStringPattern = /^(?:0|[1-9]\d*)$/
const emitterAddressPattern = /^[0-9a-fA-F]{1,128}$/

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

const operationsFromPage = (
	page: WormholescanOperationsPage,
	path: string
) => {
	if (page.operations == null)
		throw new Error(`Wormholescan_Rest: ${path} missing operations`)

	return page.operations
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
	if (vaa.id == null || vaa.id === '')
		throw new Error('Wormholescan_Rest: VAA missing id')
	if (vaa.emitterChain == null)
		throw new Error('Wormholescan_Rest: VAA missing emitter chain')
	assertWormholeChainId(vaa.emitterChain)
	if (vaa.emitterAddr == null || vaa.emitterAddr === '')
		throw new Error('Wormholescan_Rest: VAA missing emitter address')
	assertEmitterAddress(vaa.emitterAddr)
	if (vaa.sequence == null || vaa.sequence === '')
		throw new Error('Wormholescan_Rest: VAA missing sequence')
	assertSequence(vaa.sequence)
	if (vaa.timestamp == null || vaa.timestamp === '' || !Number.isFinite(Date.parse(vaa.timestamp)))
		throw new Error(`Wormholescan_Rest: invalid VAA timestamp ${vaa.timestamp}`)
	if (vaa.vaa == null || vaa.vaa.length < 1)
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
) => (
	operationsFromPage(
		await getJson<WormholescanOperationsPage>(
			binding,
			`operations${queryString(parameters)}`
		),
		'operations'
	)
)

export const getOperationById = (
	{
		chainId,
		emitter,
		sequence,
	}: {
		chainId: number
		emitter: string
		sequence: number | string
	}
) => (
	getJson<WormholescanOperation>(
		binding,
		`operations/${chainId}/${encodeURIComponent(emitter)}/${sequence}`
	)
)

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
) => (
	getJson<operations['find-global-transaction-by-id']['responses'][200]['content']['*/*']>(
		binding,
		`global-tx/${chainId}/${encodeURIComponent(emitter)}/${sequence}`
	)
)

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

	const page = await getJson<WormholescanVaaByIdResponse>(
		binding,
		`vaas/${chainId}/${encodeURIComponent(emitter)}/${sequence}${queryString({ parsedPayload })}`
	)
	if (page.data == null)
		throw new Error('Wormholescan_Rest: VAA missing data')

	assertVaa(page.data, {
		chainId,
		emitter,
		sequence,
	})

	return page.data
}
