// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum KaspaVirtualChain_TimestampSelector {
	NetworkStartHashTimestampMsSource = 'NetworkStartHashTimestampMsSource',
}
export default {
	entityType: EntityType.KaspaVirtualChain_Timestamp,
	label: 'kaspa virtual chain timestamp',
	labelPlural: 'kaspa virtual chain observations',
	selectors: [
		{
			name: KaspaVirtualChain_TimestampSelector.NetworkStartHashTimestampMsSource,
			fields: [
				'$network',
				'startHash',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.KaspaNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'startHash',
				label: 'start hash',
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
				name: 'minConfirmationCount',
				label: 'min confirmation count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'addedChainBlockHashes',
				label: 'added chain block hashes',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'removedChainBlockHashes',
				label: 'removed chain block hashes',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'acceptedTransactionCount',
				label: 'accepted transaction count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nextCheckpointHash',
				label: 'next checkpoint hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
