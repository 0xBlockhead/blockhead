// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AlgorandAccount,
	labels: {
		singular: 'algorand account',
		plural: 'algorand accounts',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.AlgorandNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$applicationLocalStateRounds: {
		label: 'application local state rounds',
		entityType: EntityType.AlgorandApplicationLocalState_Round,
		cardinality: EntityFieldCardinality.Many,
	},
	$$assetHoldingRounds: {
		label: 'asset holding rounds',
		entityType: EntityType.AlgorandAssetHolding_Round,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.AlgorandAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAddress: [
			'$network',
			'address',
		],
	},
})
