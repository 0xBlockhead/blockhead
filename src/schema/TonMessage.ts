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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	messageHash: {
		label: 'message hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$sourceTransaction: {
		label: 'source transaction',
		entityType: EntityType.TonTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outIndex: {
		label: 'out index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messageKind: {
		label: 'message kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceAddress: {
		label: 'source address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	destinationAddress: {
		label: 'destination address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueNano: {
		label: 'value nano',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdLt: {
		label: 'created lt',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ihrDisabled: {
		label: 'ihr disabled',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bounce: {
		label: 'bounce',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bounced: {
		label: 'bounced',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	opcode: {
		label: 'opcode',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bodyHash: {
		label: 'body hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stateInitHash: {
		label: 'state init hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cell: {
		label: 'cell',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$trace: {
		label: 'trace',
		entityType: EntityType.TonTrace,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$destinationTransaction: {
		label: 'destination transaction',
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
