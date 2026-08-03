// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const moneroDaemonRpcJsonRpcSources = [
	Source.MoneroDaemonRpc_JsonRpc,
] as const

export default entity({
	entityType: EntityType.MoneroNetwork,
	labels: {
		singular: 'monero network',
		plural: 'monero networks',
	},
	description: 'Monero-specific view over a canonical Network row, with daemon RPC endpoints, node observations, and recent blocks.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	rpcEndpoints: {
		primitiveType: type({
			url: type('string'),
			transportType: type('string'),
			providerName: type('string'),
		}),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	$$timestamps: {
		entityType: EntityType.MoneroNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	$$blocks: {
		entityType: EntityType.MoneroBlock,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
