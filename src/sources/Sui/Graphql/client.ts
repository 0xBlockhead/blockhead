import { print } from 'graphql'
import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import bindings from '$/sources/Sui/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import { graphql as queryGraphql } from '$/sources/_shared/wire/Graphql/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

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
		DateTime: string
		SuiAddress: string
		UInt53: number | string
	}
}>()

export const executeSui = async <
	_Result extends object,
	_Variables extends JsonValue & object,
>(
	document: TadaDocumentNode<_Result, _Variables>,
	variables: _Variables
) => {
	const data = await queryGraphql<_Result>({
		binding,
		query: print(document),
		variables,
	})
	if (data == null)
		throw new Error('Sui GraphQL: response data is missing')

	return data
}
