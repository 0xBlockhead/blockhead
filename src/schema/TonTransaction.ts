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
		label: 'account',
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.One,
	},
	lt: {
		label: 'lt',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	nowMs: {
		label: 'now ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	origStatus: {
		label: 'orig status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endStatus: {
		label: 'end status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionKind: {
		label: 'transaction kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outMessageCount: {
		label: 'out message count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalFeesNano: {
		label: 'total fees nano',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousTransactionHash: {
		label: 'previous transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousTransactionLt: {
		label: 'previous transaction lt',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$block: {
		label: 'block',
		entityType: EntityType.TonBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$trace: {
		label: 'trace',
		entityType: EntityType.TonTrace,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$inMessage: {
		label: 'in message',
		entityType: EntityType.TonMessage,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$outMessages: {
		label: 'out messages',
		entityType: EntityType.TonMessage,
		cardinality: EntityFieldCardinality.Many,
	},
	$$phases: {
		label: 'phases',
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
