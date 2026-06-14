import { type } from 'arktype'
import { CoinId } from '$/constants/Coin.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/Source.ts'

export enum AssetInstanceSelector {
	NetworkKindAssetKey = 'networkKindAssetKey',
}


export enum AssetInstanceKind {
	Native = 'Native',
	Token = 'Token',
	Denom = 'Denom',
	Mint = 'Mint',
}

export default {
	entityType: EntityType.AssetInstance,

	label: 'Asset instance',
	labelPlural: 'Asset instances',

	selectors: [
		{
			name: AssetInstanceSelector.NetworkKindAssetKey,
			fields: [
				'$network',
				'kind',
				'assetKey',
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
			name: 'kind',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(AssetInstanceKind),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'assetKey',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'coinId',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(CoinId),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'symbol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'decimals',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TrustWalletAssets_Github,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
