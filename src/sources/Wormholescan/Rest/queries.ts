import {
	getJson,
	postJson,
} from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Wormholescan/bindings.ts'
import type { operations } from '$/sources/Wormholescan/OpenApi/openapi.d.ts'
import type {
	WormholescanOperation,
	WormholescanOperationsPage,
} from '$/sources/Wormholescan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Wormholescan][0]

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
		throw new Error(`Wormholescan ${path}: operations page missing operations`)

	return page.operations
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

export const searchOperations = async (
	transactionHashes: operations['search-operations']['requestBody']['content']['application/json']
) => (
	operationsFromPage(
		await postJson<WormholescanOperationsPage>({
			binding,
			path: 'operations',
			body: transactionHashes,
		}),
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
