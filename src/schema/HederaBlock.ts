// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaBlock,
	labels: {
		singular: 'hedera block',
		plural: 'hedera blocks',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	blockHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	consensusStartTimestamp: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	consensusEndTimestamp: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	recordFileName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		entityType: EntityType.HederaTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkBlockNumber: [
			'$network',
			'blockNumber',
		],
		NetworkBlockHash: [
			'$network',
			'blockHash',
		],
	},
})
