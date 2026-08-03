// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const bittensorJsonRpcSources = [
	Source.Bittensor_JsonRpc,
] as const

export default entity({
	entityType: EntityType.BittensorNetwork,
	labels: {
		singular: 'Bittensor network',
		plural: 'Bittensor networks',
	},
	description: 'Bittensor network-specific view over a canonical Network row, with runtime observations, finalized blocks, and subnets from declared Bittensor JSON-RPC sources.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.BittensorNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: bittensorJsonRpcSources,
	},
	$$blocks: {
		entityType: EntityType.BittensorBlock,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: bittensorJsonRpcSources,
	},
	$$subnets: {
		entityType: EntityType.BittensorSubnet,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: bittensorJsonRpcSources,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
