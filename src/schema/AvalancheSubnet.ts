// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ownerAddresses: {
		label: 'owner addresses',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	threshold: {
		label: 'threshold',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	controlKeys: {
		label: 'control keys',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockchains: {
		label: 'blockchains',
		entityType: EntityType.AvalancheBlockchain,
		cardinality: EntityFieldCardinality.Many,
	},
	$$validators: {
		label: 'validators',
		entityType: EntityType.AvalancheValidator,
		cardinality: EntityFieldCardinality.Many,
	},
	$$delegators: {
		label: 'delegators',
		entityType: EntityType.AvalancheDelegator,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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
