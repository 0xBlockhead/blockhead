// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadZcashViewingKey_TimestampSelector {
	ViewingKeyTimestampMsSource = 'ViewingKeyTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadZcashViewingKey_Timestamp,
	label: 'blockhead zcash viewing key timestamp',
	labelPlural: 'blockhead zcash viewing key observations',
	selectors: [
		{
			name: BlockheadZcashViewingKey_TimestampSelector.ViewingKeyTimestampMsSource,
			fields: [
				'$viewingKey',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$viewingKey',
				label: 'viewing key',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadZcashViewingKey,
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
				name: 'lastScannedHeight',
				label: 'last scanned height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'lastScannedAt',
				label: 'last scanned AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'notesDiscovered',
				label: 'notes discovered',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nullifiersMatched',
				label: 'nullifiers matched',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
