// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	netuid: {
		label: 'Netuid',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subnetInfoByteLength: {
		label: 'Subnet info bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dynamicInfoByteLength: {
		label: 'Dynamic info bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	hyperparamsByteLength: {
		label: 'Hyperparameter bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$metagraphTimestamps: {
		label: 'Metagraph observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BittensorMetagraph_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Bittensor_JsonRpc,
		],
	},
	$$neurons: {
		label: 'Neurons',
		type: EntityFieldType.EntitiesReference,
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
