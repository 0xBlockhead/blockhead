import { print } from 'graphql'
import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import bindings from '$/sources/Amboss/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

import type { introspection } from './graphql-env.d.ts'

const binding = bindings[Source.Amboss_Graphql][0]

export const graphql = initGraphQLTada<{
	introspection: introspection
}>()

type AmbossGqlResponse<_Result> = {
	data: _Result
	errors?: readonly {
		message?: string
	}[]
}

export const queryAmboss = async <
	_Result extends object,
	_Variables extends object,
>(
	document: TadaDocumentNode<_Result, _Variables>,
	variables?: _Variables
) => {
	const response = await sourceFetch(binding, firstHttpUrlForBinding(binding), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				query: print(document),
				variables,
			}),
	})
	if (!response.ok)
		throw new Error(`Amboss_Graphql: request failed with ${response.status}`)

	const out = await response.json<AmbossGqlResponse<_Result>>()

	if (out.errors?.[0]?.message != null)
		throw new Error(`Amboss_Graphql: ${out.errors[0].message}`)

	return out.data
}
