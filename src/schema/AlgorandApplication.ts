// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AlgorandNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	applicationId: {
		label: 'application ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	creator: {
		label: 'creator',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$boxes: {
		label: 'boxes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AlgorandBox,
		cardinality: EntityFieldCardinality.Many,
	},
	$$localStateRounds: {
		label: 'local state rounds',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AlgorandApplicationLocalState_Round,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
