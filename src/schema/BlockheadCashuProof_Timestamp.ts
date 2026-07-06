// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadCashuProof_TimestampSelector {
	ProofTimestampMsSource = 'ProofTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadCashuProof_Timestamp,
	label: 'blockhead Cashu proof timestamp',
	labelPlural: 'blockhead Cashu proof observations',
	selectors: [
		{
			name: BlockheadCashuProof_TimestampSelector.ProofTimestampMsSource,
			fields: [
				'$proof',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$proof',
			label: 'proof',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadCashuProof,
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
			name: 'y',
			label: 'y',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'state',
			label: 'state',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'witness',
			label: 'witness',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'subscriptionId',
			label: 'subscription ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'quoteId',
			label: 'quote ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'method',
			label: 'method',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
