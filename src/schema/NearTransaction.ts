// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const nearRpcJsonRpcSources = [
	Source.NearRpc_JsonRpc,
] as const

export default entity({
	entityType: EntityType.NearTransaction,
	labels: {
		singular: 'near transaction',
		plural: 'near transactions',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	signerAccountId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$signer: {
		entityType: EntityType.NearAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
			Source.NearBlocks_Rest,
		],
	},
	$receiver: {
		entityType: EntityType.NearAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	nonce: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	$$actions: {
		entityType: EntityType.NearAction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: nearRpcJsonRpcSources,
	},
	$$executionOutcomes: {
		entityType: EntityType.NearExecutionOutcome,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: nearRpcJsonRpcSources,
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
