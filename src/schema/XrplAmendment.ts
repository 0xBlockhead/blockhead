// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XrplAmendmentSelector {
	NetworkAmendmentId = 'NetworkAmendmentId',
}
export const XrplAmendment = entity({
	entityType: EntityType.XrplAmendment,
	label: 'xrpl amendment',
	labelPlural: 'xrpl amendments',
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.XrplNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	amendmentId: {
		label: 'amendment ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XrplAmendment_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAmendmentId: [
			'$network',
			'amendmentId',
		],
	},
})
