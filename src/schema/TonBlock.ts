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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	workchain: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	shardPrefix: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	seqno: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	rootHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fileHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	genUtimeMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startLt: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endLt: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	minRefMcSeqno: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		entityType: EntityType.TonTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$messages: {
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
