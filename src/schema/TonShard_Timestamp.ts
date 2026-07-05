// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonShard_TimestampSelector {
	WorkchainShardPrefixSeqnoSource = 'WorkchainShardPrefixSeqnoSource',
}
export default {
	entityType: EntityType.TonShard_Timestamp,
	label: 'ton shard timestamp',
	labelPlural: 'ton shard observations',
	selectors: [
		{
			name: TonShard_TimestampSelector.WorkchainShardPrefixSeqnoSource,
			fields: [
				'$workchain',
				'shardPrefix',
				'seqno',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$workchain',
				label: 'workchain',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TonWorkchain,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'shardPrefix',
				label: 'shard prefix',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'seqno',
				label: 'seqno',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
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
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'startLt',
				label: 'start lt',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'endLt',
				label: 'end lt',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'minRefMcSeqno',
				label: 'min ref mc seqno',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'rootHash',
				label: 'root hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'fileHash',
				label: 'file hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
