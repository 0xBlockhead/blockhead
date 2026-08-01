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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	transactionHash: {
		label: 'transaction hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	logIndex: {
		label: 'log index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slashId: {
		label: 'slash ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operator: {
		label: 'operator',
		entityType: EntityType.EigenLayerOperator,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$avs: {
		label: 'AVS',
		entityType: EntityType.EigenLayerAvs,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$strategy: {
		label: 'strategy',
		entityType: EntityType.EigenLayerStrategy,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slashedShares: {
		label: 'slashed shares',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slashedAmount: {
		label: 'slashed amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reason: {
		label: 'reason',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockNumber: {
		label: 'Block number',
		description: 'The block height or number in its network.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
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
