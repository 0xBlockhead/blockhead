import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { queryTheGraph } from '$/sources/TheGraph/Graphql/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

import type { introspection } from './graphql-env.d.ts'

export const graphql = initGraphQLTada<{
	introspection: introspection
}>()

export const queryEns = <
	_Result extends object,
	_Variables extends object,
>(
	binding: SourceBinding,
	publicEnv: SourcePublicEnv,
	document: TadaDocumentNode<_Result, _Variables>,
	variables?: _Variables
) => (
	queryTheGraph({
		binding,
		document,
		publicEnv,
		variables,
	})
)
