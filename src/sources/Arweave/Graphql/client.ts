import { print } from 'graphql'
import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import { postJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

import type { introspection } from './graphql-env.d.ts'

export const graphql = initGraphQLTada<{
	introspection: introspection
}>()

type ArweaveGraphqlResponse<_Result> = {
	data?: _Result
	errors?: readonly {
		message: string
	}[]
}

export const queryArweave = async <
	_Result extends object,
	_Variables extends JsonValue & object,
>(
	binding: SourceBinding,
	document: TadaDocumentNode<_Result, _Variables>,
	variables: _Variables
) => {
	const response = await postJson<ArweaveGraphqlResponse<_Result>>({
		binding,
		body: {
			query: print(document),
			variables,
		},
	})
	if (response.errors?.[0] != null)
		throw new Error(`Arweave_Graphql: ${response.errors[0].message}`)
	if (response.data == null)
		throw new Error('Arweave_Graphql: response is missing transaction data')

	return response.data
}
