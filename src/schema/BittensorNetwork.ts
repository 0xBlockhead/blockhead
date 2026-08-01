// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BittensorNetwork,
	labels: {
		singular: 'Bittensor network',
		plural: 'Bittensor networks',
	},
	description: 'Bittensor network-specific view over a canonical Network row, with runtime observations, finalized blocks, and subnets from declared Bittensor JSON-RPC sources.',
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Runtime observations',
		entityType: EntityType.BittensorNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Bittensor_JsonRpc,
		],
	},
	$$blocks: {
		label: 'Blocks',
		entityType: EntityType.BittensorBlock,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Bittensor_JsonRpc,
		],
	},
	$$subnets: {
		label: 'Subnets',
		entityType: EntityType.BittensorSubnet,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Bittensor_JsonRpc,
		],
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
