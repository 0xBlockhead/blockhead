// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BnbBeaconTransaction,
	labels: {
		singular: 'bnb beacon transaction',
		plural: 'bnb beacon transactions',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BnbBeaconNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	txHash: {
		label: 'Transaction hash',
		description: 'The transaction hash in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	txType: {
		label: 'transaction type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	memo: {
		label: 'memo',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceAddress: {
		label: 'source address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	destinationAddress: {
		label: 'destination address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeAmount: {
		label: 'fee amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenSymbol: {
		label: 'token symbol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	orderId: {
		label: 'order ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sequence: {
		label: 'sequence',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	code: {
		label: 'code',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	log: {
		label: 'log',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$block: {
		label: 'block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BnbBeaconBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$tokenEffects: {
		label: 'token effects',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BnbBeaconTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkTxHash: [
			'$network',
			'txHash',
		],
	},
})
