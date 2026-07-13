// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EigenLayerSlashingEventSelector {
	NetworkTransactionHashLogIndex = 'NetworkTransactionHashLogIndex',
	OperatorAvsSourceSlashId = 'OperatorAvsSourceSlashId',
}
export const EigenLayerSlashingEvent = entity({
	entityType: EntityType.EigenLayerSlashingEvent,
	labels: {
		singular: 'eigen layer slashing event',
		plural: 'eigen layer slashing events',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	transactionHash: {
		label: 'transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	logIndex: {
		label: 'log index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slashId: {
		label: 'slash ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operator: {
		label: 'operator',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EigenLayerOperator,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$avs: {
		label: 'AVS',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EigenLayerAvs,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$strategy: {
		label: 'strategy',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EigenLayerStrategy,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slashedShares: {
		label: 'slashed shares',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slashedAmount: {
		label: 'slashed amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reason: {
		label: 'reason',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockNumber: {
		label: 'Block number',
		description: 'The block height or number in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
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
