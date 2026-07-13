// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NearTransactionSelector {
	NetworkHash = 'NetworkHash',
	NetworkHashSignerAccountId = 'NetworkHashSignerAccountId',
}
export const NearTransaction = entity({
	entityType: EntityType.NearTransaction,
	labels: {
		singular: 'near transaction',
		plural: 'near transactions',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	signerAccountId: {
		label: 'Signer account ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$signer: {
		label: 'Signer',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.NearAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
			Source.NearBlocks_Rest,
		],
	},
	$receiver: {
		label: 'Receiver',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.NearAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	nonce: {
		label: 'Nonce',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	$$actions: {
		label: 'Actions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.NearAction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	$$executionOutcomes: {
		label: 'Execution outcomes',
		type: EntityFieldType.EntitiesReference,
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
