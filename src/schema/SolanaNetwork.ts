import { type } from 'arktype'

import { NetworkEnvironment } from '$/constants/Network.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { networkFields } from '$/schema/Network.ts'
import { Source } from '$/sources/Source.ts'

export enum SolanaNetworkSelector {
	Caip2 = 'caip2',
}


const solanaRpcEndpointField = type({
	url: UrlString,
	transportType: type.valueOf(TransportType),
	providerName: 'string',
})

export default {
	entityType: EntityType.SolanaNetwork,

	label: 'Solana network',
	labelPlural: 'Solana networks',

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
			type: EntityFieldType.Primitive,
			primitiveType: type({
				namespace: type.unit('solana'),
				reference: 'string',
			}),
			cardinality: EntityFieldCardinality.One,
		},
		networkFields[0],
		networkFields[1],
		networkFields[2],
		networkFields[3],
		{
			name: 'environment',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(NetworkEnvironment),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'rpcEndpoints',
			type: EntityFieldType.Primitive,
			primitiveType: solanaRpcEndpointField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaNetwork_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: '$$blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaBlock,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: '$$transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTransaction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: '$$accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaAccount,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: '$$validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaValidator,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
