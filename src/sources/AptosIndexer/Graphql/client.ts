import { print } from 'graphql'
import type { TadaDocumentNode } from 'gql.tada'

import { throwHttpError } from '$/lib/http.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

type AptosIndexerGraphqlResponse<_Result> = {
	data?: _Result
	errors?: readonly {
		message?: string
	}[]
}

const aptosIndexerBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.AptosIndexer_Graphql
		&& binding.target.kind === SourceTargetKind.Caip2Network
		&& binding.target.key === 'aptos:1'
	))

if (aptosIndexerBindings.length !== 1)
	throw new Error('AptosIndexer_Graphql: canonical Aptos mainnet source binding is missing or ambiguous')

const [aptosIndexerBinding] = aptosIndexerBindings

export const executeAptosIndexer = async <
	_Result extends object,
	_Variables extends object,
>(
	document: TadaDocumentNode<_Result, _Variables>,
	variables: _Variables
) => {
	const response = await sourceFetch(aptosIndexerBinding, firstHttpUrlForBinding(aptosIndexerBinding), {
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
		await throwHttpError('AptosIndexer_Graphql', response)

	const payload: AptosIndexerGraphqlResponse<_Result> = await response.json()
	if (payload.errors?.[0]?.message != null)
		throw new Error(`AptosIndexer_Graphql: ${payload.errors[0].message}`)
	if (payload.data == null)
		throw new Error('AptosIndexer_Graphql: response data is missing')

	return payload.data
}
