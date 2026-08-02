import { print } from 'graphql'
import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { graphql as queryGraphql } from '$/sources/_shared/wire/Graphql/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

import type { introspection } from './graphql-env.d.ts'

export const graphql = initGraphQLTada<{
	introspection: introspection
}>()

export const queryArweave = async <
	_Result extends object,
	_Variables extends JsonValue & object,
>(
	binding: SourceBinding,
	document: TadaDocumentNode<_Result, _Variables>,
	variables: _Variables
) => {
	const data = await queryGraphql<_Result>({
		binding,
		query: print(document),
		variables,
	})
	if (data == null)
		throw new Error('Arweave_Graphql: response is missing transaction data')

	return data
}
