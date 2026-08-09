// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TonTransaction,
	labels: {
		singular: 'ton transaction',
		plural: 'ton transactions',
	},
})({
	$account: {
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.One,
	},
	lt: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	nowMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	origStatus: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endStatus: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outMessageCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalFeesNano: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousTransactionHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousTransactionLt: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$block: {
		entityType: EntityType.TonBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$trace: {
		entityType: EntityType.TonTrace,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$inMessage: {
		entityType: EntityType.TonMessage,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$outMessages: {
		entityType: EntityType.TonMessage,
		cardinality: EntityFieldCardinality.Many,
	},
	$$phases: {
		entityType: EntityType.TonTransactionPhase,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		AccountLt: [
			'$account',
			'lt',
		],
		AccountLtHash: [
			'$account',
			'lt',
			'hash',
		],
	},
})
