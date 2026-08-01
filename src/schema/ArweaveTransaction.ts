// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ArweaveTransaction,
	labels: {
		singular: 'arweave transaction',
		plural: 'arweave transactions',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.ArweaveNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	transactionId: {
		label: 'transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ownerAddress: {
		label: 'owner address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	targetAddress: {
		label: 'target address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quantityWinston: {
		label: 'quantity winston',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardWinston: {
		label: 'reward winston',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signature: {
		label: 'signature',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastTx: {
		label: 'last transaction',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dataRoot: {
		label: 'data root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dataSizeBytes: {
		label: 'data size bytes',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dataTree: {
		label: 'data tree',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	tags: {
		label: 'tags',
		primitiveType: type({
			name: type('string'),
			value: type('string'),
		}),
		cardinality: EntityFieldCardinality.Many,
	},
	format: {
		label: 'format',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	denomination: {
		label: 'denomination',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$block: {
		label: 'block',
		entityType: EntityType.ArweaveBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$resource: {
		label: 'resource',
		entityType: EntityType.ArweaveResource,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkTransactionId: [
			'$network',
			'transactionId',
		],
	},
})
