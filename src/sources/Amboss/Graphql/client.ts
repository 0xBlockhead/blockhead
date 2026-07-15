import { print } from 'graphql'
import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import { getJson } from '$/lib/http.ts'
import {
	ambossOrigins,
	graphqlUrl,
} from '$/sources/Amboss/Graphql/constants.ts'

import type { introspection } from './graphql-env.d.ts'

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
): Promise<_Result> => {
	const out = await getJson<AmbossGqlResponse<_Result>>(graphqlUrl, {
		origins: ambossOrigins,
		init: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				query: print(document),
				variables,
			}),
		},
	})

	if (out.errors?.[0]?.message != null)
		throw new Error(`Amboss_Graphql: ${out.errors[0].message}`)

	return out.data
}
