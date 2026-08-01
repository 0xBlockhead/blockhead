// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StarknetTransaction,
	labels: {
		singular: 'starknet transaction',
		plural: 'starknet transactions',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.StarknetNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	transactionHash: {
		label: 'transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionKind: {
		label: 'transaction kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$block: {
		label: 'block',
		entityType: EntityType.StarknetBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	senderAddress: {
		label: 'sender address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$senderContract: {
		label: 'sender contract',
		entityType: EntityType.StarknetContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nonce: {
		label: 'nonce',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maxFee: {
		label: 'max fee',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resourceBounds: {
		label: 'resource bounds',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	calldata: {
		label: 'calldata',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	signature: {
		label: 'signature',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	$$events: {
		label: 'events',
		entityType: EntityType.StarknetEvent,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.StarknetTransaction_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkTransactionHash: [
			'$network',
			'transactionHash',
		],
	},
})
