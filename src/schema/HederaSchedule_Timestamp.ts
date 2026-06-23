import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum HederaSchedule_TimestampSelector {
	ScheduleTimestampMsSource = '$schedule+timestampMs+source',
}
export default {
	entityType: EntityType.HederaSchedule_Timestamp,
	label: 'hedera schedule timestamp',
	labelPlural: 'hedera schedule observations',
	selectors: [
		{
			name: HederaSchedule_TimestampSelector.ScheduleTimestampMsSource,
			fields: [
				'$schedule',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$schedule',
			label: 'schedule',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HederaSchedule,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'executedTimestamp',
			label: 'executed timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'deleted',
			label: 'deleted',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'expirationTime',
			label: 'expiration time',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'waitForExpiry',
			label: 'wait for expiry',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'signatureCount',
			label: 'signature count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$executionTransaction',
			label: 'execution transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HederaTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
