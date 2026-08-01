// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CosmosTransaction,
	labels: {
		singular: 'Cosmos transaction',
		plural: 'Cosmos transactions',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	txHash: {
		label: 'Transaction hash',
		description: 'The transaction hash in its network.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		label: 'Block',
		entityType: EntityType.CosmosBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	code: {
		label: 'Code',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	codespace: {
		label: 'Codespace',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasWanted: {
		label: 'Gas wanted',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		label: 'Gas used',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeAmount: {
		label: 'Fee amount',
		primitiveType: type({
			denom: type('string'),
			amount: type('bigint'),
		}),
		cardinality: EntityFieldCardinality.Many,
	},
	feeGasLimit: {
		label: 'Fee gas limit',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	memo: {
		label: 'Memo',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timeoutHeight: {
		label: 'Timeout height',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signerAddresses: {
		label: 'Signer addresses',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	signatures: {
		label: 'Signatures',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	rawLog: {
		label: 'Raw log',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	eventTypes: {
		label: 'Event types',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	$$messages: {
		label: 'Messages',
		entityType: EntityType.CosmosMessage,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CosmosSdk_Rest,
		],
	},
})({
	selectors: {
		NetworkTxHash: [
			'$network',
			'txHash',
		],
	},
})
