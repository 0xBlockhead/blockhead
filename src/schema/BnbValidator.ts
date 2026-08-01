// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BnbValidator,
	labels: {
		singular: 'bnb validator',
		plural: 'bnb validators',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.BnbBeaconNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	operatorAddress: {
		label: 'operator address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	consensusAddress: {
		label: 'consensus address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	moniker: {
		label: 'moniker',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BnbValidator_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkOperatorAddress: [
			'$network',
			'operatorAddress',
		],
	},
})
