// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AlgorandApplication,
	labels: {
		singular: 'algorand application',
		plural: 'algorand applications',
	},
})({
	$network: {
		entityType: EntityType.AlgorandNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	applicationId: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	creator: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$boxes: {
		entityType: EntityType.AlgorandBox,
		cardinality: EntityFieldCardinality.Many,
	},
	$$localStateRounds: {
		entityType: EntityType.AlgorandApplicationLocalState_Round,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.AlgorandApplication_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkApplicationId: [
			'$network',
			'applicationId',
		],
	},
})
