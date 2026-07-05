// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NearTransactionSelector {
	NetworkHash = 'NetworkHash',
	NetworkHashSignerAccountId = 'NetworkHashSignerAccountId',
}
export default {
	entityType: EntityType.NearTransaction,
	label: 'near transaction',
	labelPlural: 'near transactions',
	selectors: [
		{
			name: NearTransactionSelector.NetworkHash,
			fields: [
				'$network',
				'hash',
			],
		},
		{
			name: NearTransactionSelector.NetworkHashSignerAccountId,
			fields: [
				'$network',
				'hash',
				'signerAccountId',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'hash',
				label: 'Hash',
				description: 'The hash that identifies this object in its protocol.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'signerAccountId',
				label: 'Signer account ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$signer',
				label: 'Signer',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.NearAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
					Source.NearBlocks_Rest,
				],
		},
		{
				name: '$receiver',
				label: 'Receiver',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.NearAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
		{
				name: 'nonce',
				label: 'Nonce',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
		{
				name: '$$actions',
				label: 'Actions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.NearAction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
		{
				name: '$$executionOutcomes',
				label: 'Execution outcomes',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.NearExecutionOutcome,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
	],
} as const satisfies EntityDefinition
