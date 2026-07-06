// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SolanaNetworkSelector {
	Caip2 = 'Caip2',
}
export default {
	entityType: EntityType.SolanaNetwork,
	label: 'Solana network',
	labelPlural: 'Solana networks',
	description: 'A Solana cluster identified by its CAIP-2 namespace and reference.',
	selectors: [
		{
			name: SolanaNetworkSelector.Caip2,
			fields: [
				'caip2',
			],
		},
	],
	fields: [
		{
			name: 'name',
			label: 'Name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'caip2',
			label: 'CAIP-2',
			description: 'The chain identifier in CAIP-2 namespace and reference form.',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'namespace': type.unit('solana'), 'reference': type('string') }),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'environment',
			label: 'Environment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'rpcEndpoints',
			label: 'RPC endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'Timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blocks',
			label: 'Blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transactions',
			label: 'Transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$accounts',
			label: 'Accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaAccount,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$programs',
			label: 'Programs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaProgram,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$tokenAccounts',
			label: 'Token accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTokenAccount,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$tokenMints',
			label: 'Token mints',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTokenMint,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$validators',
			label: 'Validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaValidator,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
