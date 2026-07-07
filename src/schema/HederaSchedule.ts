// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaScheduleSelector {
	NetworkScheduleId = 'NetworkScheduleId',
}
export default {
	entityType: EntityType.HederaSchedule,
	label: 'hedera schedule',
	labelPlural: 'hedera schedules',
	selectors: [
		{
			name: HederaScheduleSelector.NetworkScheduleId,
			fields: [
				'$network',
				'scheduleId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HederaNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'scheduleId',
			label: 'schedule ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'creatorAccountId',
			label: 'creator account ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'payerAccountId',
			label: 'payer account ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionBody',
			label: 'transaction body',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$signatures',
			label: 'signatures',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaScheduleSignature,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaSchedule_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
