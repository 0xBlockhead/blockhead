// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TonBlock,
	labels: {
		singular: 'ton block',
		plural: 'ton blocks',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	workchain: {
		label: 'workchain',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	shardPrefix: {
		label: 'shard prefix',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	seqno: {
		label: 'seqno',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	rootHash: {
		label: 'root hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fileHash: {
		label: 'file hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	genUtimeMs: {
		label: 'gen utime ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startLt: {
		label: 'start lt',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endLt: {
		label: 'end lt',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	minRefMcSeqno: {
		label: 'min ref mc seqno',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.TonTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$messages: {
		label: 'messages',
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
