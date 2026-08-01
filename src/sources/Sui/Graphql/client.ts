import {
	print,
	type ExecutionResult,
} from 'graphql'
import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import { throwHttpError } from '$/lib/http.ts'
import bindings from '$/sources/Sui/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

import type { introspection } from './graphql-env.d.ts'

const binding = bindings[Source.Sui].find(
	({ apiFamily }) => apiFamily === ApiFamily.GraphqlHttp
)

if (binding == null)
	throw new Error('Sui GraphQL binding is missing')

export const graphql = initGraphQLTada<{
	introspection: introspection
	scalars: {
		BigInt: string
		SuiAddress: string
	}
}>()

export const executeSui = async <
	_Result extends object,
	_Variables extends object,
>(
	document: TadaDocumentNode<_Result, _Variables>,
	variables: _Variables
) => {
	const response = await sourceFetch(binding, firstHttpUrlForBinding(binding), {
		method: 'POST',
		headers: {
		accept: 'application/json',
		'content-type': 'application/json',
		},
		body: JSON.stringify({
			query: print(document),
			variables,
		}),
	})
	if (!response.ok)
		await throwHttpError('Sui GraphQL', response)

	const payload = await response.json<ExecutionResult<_Result>>()
	if (payload.errors?.[0] != null)
		throw new Error(`Sui GraphQL: ${payload.errors[0].message}`)
	if (payload.data == null)
		throw new Error('Sui GraphQL: response data is missing')

	return payload.data
}
