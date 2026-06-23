import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum SolanaNetworkSelector {
	Caip2 = 'caip2',
}
export default {
	entityType: EntityType.SolanaNetwork,
	label: 'solana network',
	labelPlural: 'solana networks',
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
			name: 'caip2',
			label: 'CAIP-2',
			description: 'The chain identifier in CAIP-2 namespace and reference form.',
			type: EntityFieldType.Primitive,
			primitiveType: type({"namespace": "'solana'", "reference": "string"}),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'environment',
			label: 'environment',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'rpcEndpoints',
			label: 'RPC endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({"url": "string", "transportType": "string", "providerName": "string"}),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$accounts',
			label: 'accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaAccount,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$tokenAccounts',
			label: 'token accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTokenAccount,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$tokenMints',
			label: 'token mints',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTokenMint,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$validators',
			label: 'validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaValidator,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
