// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonTransactionSelector {
	AccountLt = 'AccountLt',
	AccountLtHash = 'AccountLtHash',
}
export const TonTransaction = entity({
	entityType: EntityType.TonTransaction,
	labels: {
		singular: 'ton transaction',
		plural: 'ton transactions',
	},
})({
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.One,
	},
	lt: {
		label: 'lt',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nowMs: {
		label: 'now ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	origStatus: {
		label: 'orig status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endStatus: {
		label: 'end status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionKind: {
		label: 'transaction kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outMessageCount: {
		label: 'out message count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalFeesNano: {
		label: 'total fees nano',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousTransactionHash: {
		label: 'previous transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousTransactionLt: {
		label: 'previous transaction lt',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$block: {
		label: 'block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TonBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$trace: {
		label: 'trace',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TonTrace,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$inMessage: {
		label: 'in message',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TonMessage,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$outMessages: {
		label: 'out messages',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonMessage,
		cardinality: EntityFieldCardinality.Many,
	},
	$$phases: {
		label: 'phases',
		type: EntityFieldType.EntitiesReference,
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
