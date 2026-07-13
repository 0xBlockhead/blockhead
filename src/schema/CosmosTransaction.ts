// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CosmosTransactionSelector {
	NetworkTxHash = 'NetworkTxHash',
}
export const CosmosTransaction = entity({
	entityType: EntityType.CosmosTransaction,
	labels: {
		singular: 'Cosmos transaction',
		plural: 'Cosmos transactions',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	txHash: {
		label: 'Transaction hash',
		description: 'The transaction hash in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		label: 'Block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CosmosBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	code: {
		label: 'Code',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	codespace: {
		label: 'Codespace',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasWanted: {
		label: 'Gas wanted',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		label: 'Gas used',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeAmount: {
		label: 'Fee amount',
		type: EntityFieldType.Primitive,
		primitiveType: type({ 'denom': type('string'), 'amount': type('bigint') }),
		cardinality: EntityFieldCardinality.Many,
	},
	feeGasLimit: {
		label: 'Fee gas limit',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	memo: {
		label: 'Memo',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timeoutHeight: {
		label: 'Timeout height',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signerAddresses: {
		label: 'Signer addresses',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	signatures: {
		label: 'Signatures',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	rawLog: {
		label: 'Raw log',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	eventTypes: {
		label: 'Event types',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	$$messages: {
		label: 'Messages',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CosmosMessage,
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
