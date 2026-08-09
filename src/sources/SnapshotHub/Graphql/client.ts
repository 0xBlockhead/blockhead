import { print } from 'graphql'
import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { graphql as queryGraphql } from '$/sources/_shared/wire/Graphql/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

import type { introspection } from './graphql-env.d.ts'

export const maximumSnapshotHubGraphqlResponseBytes = 2_000_000

export const graphql = initGraphQLTada<{
	introspection: introspection
	scalars: {
		Any: JsonValue
	}
}>()

export const querySnapshotHub = async <
	_Result extends object,
	_Variables extends JsonValue & object,
>(
	binding: SourceBinding,
	document: TadaDocumentNode<_Result, _Variables>,
	variables: _Variables
) => {
	const data = await queryGraphql<_Result>({
		binding,
		maximumResponseBytes: maximumSnapshotHubGraphqlResponseBytes,
		query: print(document),
		variables,
	})
	if (data == null)
		throw new Error('SnapshotHub_Graphql: response is missing data')

	return data
}
