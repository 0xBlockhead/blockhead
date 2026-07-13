// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaScheduleSelector {
	NetworkScheduleId = 'NetworkScheduleId',
}
export const HederaSchedule = entity({
	entityType: EntityType.HederaSchedule,
	labels: {
		singular: 'hedera schedule',
		plural: 'hedera schedules',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	scheduleId: {
		label: 'schedule ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	creatorAccountId: {
		label: 'creator account ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payerAccountId: {
		label: 'payer account ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionBody: {
		label: 'transaction body',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$signatures: {
		label: 'signatures',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaScheduleSignature,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaSchedule_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkScheduleId: [
			'$network',
			'scheduleId',
		],
	},
})
