// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadLitecoinMwebOutputState_TimestampSelector {
	OutputStateTimestampMsSource = 'OutputStateTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadLitecoinMwebOutputState_Timestamp,
	label: 'blockhead litecoin mweb output state timestamp',
	labelPlural: 'blockhead litecoin mweb output state observations',
	selectors: [
		{
			name: BlockheadLitecoinMwebOutputState_TimestampSelector.OutputStateTimestampMsSource,
			fields: [
				'$outputState',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$outputState',
				label: 'output state',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadLitecoinMwebOutputState,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'spent',
				label: 'spent',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'spendTransactionId',
				label: 'spend transaction ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'receivedAtHeight',
				label: 'received AT height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'spentAtHeight',
				label: 'spent AT height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'confirmations',
				label: 'confirmations',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'lastScannedAt',
				label: 'last scanned AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
