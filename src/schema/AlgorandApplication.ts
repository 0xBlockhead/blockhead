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
		label: 'network',
		entityType: EntityType.AlgorandNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	applicationId: {
		label: 'application ID',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	creator: {
		label: 'creator',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$boxes: {
		label: 'boxes',
		entityType: EntityType.AlgorandBox,
		cardinality: EntityFieldCardinality.Many,
	},
	$$localStateRounds: {
		label: 'local state rounds',
		entityType: EntityType.AlgorandApplicationLocalState_Round,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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
