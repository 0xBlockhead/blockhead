// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MoneroNetwork,
	labels: {
		singular: 'monero network',
		plural: 'monero networks',
	},
	description: 'Monero-specific view over a canonical Network row, with daemon RPC endpoints, node observations, and recent blocks.',
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	rpcEndpoints: {
		label: 'RPC endpoints',
		type: EntityFieldType.Primitive,
		primitiveType: type({
			url: type('string'),
			transportType: type('string'),
			providerName: type('string'),
		}),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.MoneroNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	$$blocks: {
		label: 'Blocks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.MoneroBlock,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
