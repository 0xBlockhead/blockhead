// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AssetFormatSupport_TimestampSelector {
	AssetInstanceFormatIdTimestampMsSource = 'AssetInstanceFormatIdTimestampMsSource',
}
export default {
	entityType: EntityType.AssetFormatSupport_Timestamp,
	label: 'asset format support timestamp',
	labelPlural: 'asset format support observations',
	selectors: [
		{
			name: AssetFormatSupport_TimestampSelector.AssetInstanceFormatIdTimestampMsSource,
			fields: [
				'$assetInstance',
				'formatId',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$assetInstance',
				label: 'Asset instance',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AssetInstance,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'formatId',
				label: 'Format ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
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
				name: 'confidence',
				label: 'Confidence',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'evidenceKind',
				label: 'Evidence kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ledgerCoordinateKind',
				label: 'Ledger coordinate kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ledgerCoordinateValue',
				label: 'Ledger coordinate value',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'interfaceId',
				label: 'Interface ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'programId',
				label: 'Program ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'moduleId',
				label: 'Module ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'contractAddress',
				label: 'Contract address',
				description: 'The contract address on its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'tokenProgram',
				label: 'Token program',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'notes',
				label: 'Notes',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
