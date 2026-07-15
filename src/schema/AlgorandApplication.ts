// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AlgorandApplicationSelector {
	NetworkApplicationId = 'NetworkApplicationId',
}
export const AlgorandApplication = entity({
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
