import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { queryTheGraph } from '$/sources/TheGraph/Graphql/client.ts'

import type { introspection } from './graphql-env.d.ts'

export const ensGraphqlEndpointUrl = 'https://gateway.thegraph.com/api/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH'

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
	await queryTheGraph({
		document,
		endpointUrl: ensGraphqlEndpointUrl,
		publicEnv,
		variables,
	})
)
