import {
	getJson,
	postJson,
} from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Wormholescan/bindings.ts'
import type { operations } from '$/sources/Wormholescan/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Wormholescan][0]

export const getHealth = () => (
	getJson<operations['health-check']['responses'][200]['content']['*/*']>(
		binding,
		'health'
	)
)

export const getOperations = (
	parameters: NonNullable<operations['get-operations']['parameters']['query']> = {}
) => {
	const searchParameters = new URLSearchParams(
		Object.entries(parameters).flatMap(([name, value]) => (
			value == null ? [] : [[name, String(value)]]
		))
	)

	return getJson<operations['get-operations']['responses'][200]['content']['*/*']>(
		binding,
		`operations${searchParameters.size === 0 ? '' : `?${searchParameters}`}`
	)
}

export const searchOperations = (
	transactionHashes: operations['search-operations']['requestBody']['content']['application/json']
) => (
	postJson<operations['search-operations']['responses'][200]['content']['*/*']>({
		binding,
		path: 'operations',
		body: transactionHashes,
	})
)
