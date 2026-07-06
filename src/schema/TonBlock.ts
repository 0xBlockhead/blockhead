// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonBlockSelector {
	NetworkWorkchainShardPrefixSeqno = 'NetworkWorkchainShardPrefixSeqno',
	NetworkRootHashFileHash = 'NetworkRootHashFileHash',
}
export default {
	entityType: EntityType.TonBlock,
	label: 'ton block',
	labelPlural: 'ton blocks',
	selectors: [
		{
			name: TonBlockSelector.NetworkWorkchainShardPrefixSeqno,
			fields: [
				'$network',
				'workchain',
				'shardPrefix',
				'seqno',
			],
		},
		{
			name: TonBlockSelector.NetworkRootHashFileHash,
			fields: [
				'$network',
				'rootHash',
				'fileHash',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'workchain',
			label: 'workchain',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
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
		{
			name: 'genUtimeMs',
			label: 'gen utime ms',
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
			name: '$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$messages',
			label: 'messages',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonMessage,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
