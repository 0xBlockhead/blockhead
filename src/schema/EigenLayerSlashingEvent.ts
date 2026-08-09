// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EigenLayerSlashingEvent,
	labels: {
		singular: 'eigen layer slashing event',
		plural: 'eigen layer slashing events',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	transactionHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	logIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slashId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operator: {
		entityType: EntityType.EigenLayerOperator,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$avs: {
		entityType: EntityType.EigenLayerAvs,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$strategy: {
		entityType: EntityType.EigenLayerStrategy,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slashedShares: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slashedAmount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reason: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkTransactionHashLogIndex: [
			'$network',
			'transactionHash',
			'logIndex',
		],
		OperatorAvsSourceSlashId: [
			'$operator',
			'$avs',
			'source',
			'slashId',
		],
	},
})
