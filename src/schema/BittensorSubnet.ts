// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const bittensorJsonRpcSources = [
	Source.Bittensor_JsonRpc,
] as const

export default entity({
	entityType: EntityType.BittensorSubnet,
	labels: {
		singular: 'Bittensor subnet',
		plural: 'Bittensor subnets',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	netuid: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subnetInfoByteLength: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dynamicInfoByteLength: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	hyperparamsByteLength: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$metagraphTimestamps: {
		entityType: EntityType.BittensorMetagraph_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: bittensorJsonRpcSources,
	},
	$$neurons: {
		entityType: EntityType.BittensorNeuron,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: bittensorJsonRpcSources,
	},
})({
	selectors: {
		NetworkNetuid: [
			'$network',
			'netuid',
		],
	},
})
