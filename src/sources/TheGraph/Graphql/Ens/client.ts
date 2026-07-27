import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { queryTheGraph } from '$/sources/TheGraph/Graphql/client.ts'

import type { introspection } from './graphql-env.d.ts'

export const graphql = initGraphQLTada<{
	introspection: introspection
}>()

export const queryEns = async <
	_Result extends object,
	_Variables extends object,
>(
	publicEnv: SourcePublicEnv,
	document: TadaDocumentNode<_Result, _Variables>,
	variables?: _Variables
) => (
	queryTheGraph({
		document,
		publicEnv,
		variables,
	})
)
