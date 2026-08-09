// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TonMessage,
	labels: {
		singular: 'ton message',
		plural: 'ton messages',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	messageHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$sourceTransaction: {
		entityType: EntityType.TonTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messageKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	destinationAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueNano: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdLt: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ihrDisabled: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bounce: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bounced: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	opcode: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bodyHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stateInitHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cell: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$trace: {
		entityType: EntityType.TonTrace,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$destinationTransaction: {
		entityType: EntityType.TonTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkMessageHash: [
			'$network',
			'messageHash',
		],
		SourceTransactionOutIndex: [
			'$sourceTransaction',
			'outIndex',
		],
	},
})
