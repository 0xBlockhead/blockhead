import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum CosmosNetwork_TimestampSelector {
	NetworkTimestampMs = 'networkTimestampMs',
}
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.CosmosNetwork_Timestamp,

	label: 'Cosmos network snapshot',
	labelPlural: 'Cosmos network snapshots',

	selectors: [
		{
			name: CosmosNetwork_TimestampSelector.NetworkTimestampMs,
			fields: [
				'$network',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'latestBlockHeight',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: 'latestBlockHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: 'latestBlockTimeMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: 'latestBlockTransactionCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: 'chainId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: 'nodeNetwork',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: 'applicationName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: 'applicationVersion',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: 'cosmosSdkVersion',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: 'isSyncing',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: 'validatorCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: 'bondedValidatorCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: 'bondedTokens',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: 'notBondedTokens',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: 'governanceProposalCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
