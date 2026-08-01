// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BittensorSubnet,
	labels: {
		singular: 'Bittensor subnet',
		plural: 'Bittensor subnets',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	netuid: {
		label: 'Netuid',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subnetInfoByteLength: {
		label: 'Subnet info bytes',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dynamicInfoByteLength: {
		label: 'Dynamic info bytes',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	hyperparamsByteLength: {
		label: 'Hyperparameter bytes',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$metagraphTimestamps: {
		label: 'Metagraph observations',
		entityType: EntityType.BittensorMetagraph_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Bittensor_JsonRpc,
		],
	},
	$$neurons: {
		label: 'Neurons',
		entityType: EntityType.BittensorNeuron,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Bittensor_JsonRpc,
		],
	},
})({
	selectors: {
		NetworkNetuid: [
			'$network',
			'netuid',
		],
	},
})
