import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { queryTheGraph } from '$/sources/TheGraph/Graphql/client.ts'

import type { introspection } from './graphql-env.d.ts'

export const messariAaveV3EthereumGraphqlEndpointUrl = 'https://gateway.thegraph.com/api/subgraphs/id/HB1Z2EAw4rtPRYVb2Nz8QGFLHCpym6ByBX6vbCViuE9F'

export const graphql = initGraphQLTada<{
	introspection: introspection
}>()

export const queryMessariAaveV3Ethereum = async <
	_Result extends {
		[key: string]: any
	},
	_Variables extends {
		[key: string]: any
	},
>(
	publicEnv: SourcePublicEnvFor<Source.TheGraph_Graphql>,
	document: TadaDocumentNode<_Result, _Variables>,
	variables?: _Variables,
) => (
	await queryTheGraph({
		document,
		endpointUrl: messariAaveV3EthereumGraphqlEndpointUrl,
		publicEnv,
		variables,
	})
)
