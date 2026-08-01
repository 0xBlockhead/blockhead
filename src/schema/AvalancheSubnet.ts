// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AvalancheSubnet,
	labels: {
		singular: 'avalanche subnet',
		plural: 'avalanche subnets',
	},
})({
	subnetId: {
		label: 'subnet ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ownerAddresses: {
		label: 'owner addresses',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	threshold: {
		label: 'threshold',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	controlKeys: {
		label: 'control keys',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockchains: {
		label: 'blockchains',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AvalancheBlockchain,
		cardinality: EntityFieldCardinality.Many,
	},
	$$validators: {
		label: 'validators',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AvalancheValidator,
		cardinality: EntityFieldCardinality.Many,
	},
	$$delegators: {
		label: 'delegators',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AvalancheDelegator,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AvalancheSubnet_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		SubnetId: [
			'subnetId',
		],
	},
})
