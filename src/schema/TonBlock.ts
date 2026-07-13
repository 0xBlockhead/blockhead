// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonBlockSelector {
	NetworkWorkchainShardPrefixSeqno = 'NetworkWorkchainShardPrefixSeqno',
	NetworkRootHashFileHash = 'NetworkRootHashFileHash',
}
export const TonBlock = entity({
	entityType: EntityType.TonBlock,
	labels: {
		singular: 'ton block',
		plural: 'ton blocks',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TonNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	workchain: {
		label: 'workchain',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	shardPrefix: {
		label: 'shard prefix',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	seqno: {
		label: 'seqno',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	rootHash: {
		label: 'root hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fileHash: {
		label: 'file hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	genUtimeMs: {
		label: 'gen utime ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startLt: {
		label: 'start lt',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endLt: {
		label: 'end lt',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	minRefMcSeqno: {
		label: 'min ref mc seqno',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$messages: {
		label: 'messages',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonMessage,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkWorkchainShardPrefixSeqno: [
			'$network',
			'workchain',
			'shardPrefix',
			'seqno',
		],
		NetworkRootHashFileHash: [
			'$network',
			'rootHash',
			'fileHash',
		],
	},
})
