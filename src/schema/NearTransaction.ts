// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NearTransaction,
	labels: {
		singular: 'near transaction',
		plural: 'near transactions',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	signerAccountId: {
		label: 'Signer account ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$signer: {
		label: 'Signer',
		entityType: EntityType.NearAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
			Source.NearBlocks_Rest,
		],
	},
	$receiver: {
		label: 'Receiver',
		entityType: EntityType.NearAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	nonce: {
		label: 'Nonce',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	$$actions: {
		label: 'Actions',
		entityType: EntityType.NearAction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	$$executionOutcomes: {
		label: 'Execution outcomes',
		entityType: EntityType.NearExecutionOutcome,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
})({
	selectors: {
		NetworkHash: [
			'$network',
			'hash',
		],
		NetworkHashSignerAccountId: [
			'$network',
			'hash',
			'signerAccountId',
		],
	},
})
