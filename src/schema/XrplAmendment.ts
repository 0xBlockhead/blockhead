// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XrplAmendmentSelector {
	NetworkAmendmentId = 'NetworkAmendmentId',
}
export const XrplAmendment = entity({
	entityType: EntityType.XrplAmendment,
	labels: {
		singular: 'xrpl amendment',
		plural: 'xrpl amendments',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
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
