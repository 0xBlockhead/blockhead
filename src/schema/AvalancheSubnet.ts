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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ownerAddresses: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	threshold: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	controlKeys: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockchains: {
		entityType: EntityType.AvalancheBlockchain,
		cardinality: EntityFieldCardinality.Many,
	},
	$$validators: {
		entityType: EntityType.AvalancheValidator,
		cardinality: EntityFieldCardinality.Many,
	},
	$$delegators: {
		entityType: EntityType.AvalancheDelegator,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
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
