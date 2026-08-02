import { print } from 'graphql'
import type { TadaDocumentNode } from 'gql.tada'

import { throwHttpError } from '$/lib/http.ts'
import bindings from '$/sources/AptosIndexer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

const binding = bindings[Source.AptosIndexer_Graphql][0]

type AptosIndexerGraphqlResponse<_Result> = {
	data?: _Result
	errors?: readonly {
		message?: string
	}[]
}

export const executeAptosIndexer = async <
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
		await throwHttpError('AptosIndexer_Graphql', response)

	const payload = await response.json<AptosIndexerGraphqlResponse<_Result>>()
	if (payload.errors?.[0]?.message != null)
		throw new Error(`AptosIndexer_Graphql: ${payload.errors[0].message}`)
	if (payload.data == null)
		throw new Error('AptosIndexer_Graphql: response data is missing')

	return payload.data
}
