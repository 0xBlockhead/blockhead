import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { CoinId } from '$/constants/Coin.ts'
export enum AssetInstanceKind {
	Native = 'Native',
	Token = 'Token',
	Denom = 'Denom',
	Mint = 'Mint',
}
export enum AssetInstanceSelector {
	NetworkKindAssetKey = 'networkKindAssetKey',
}
export default {
	entityType: EntityType.AssetInstance,
	label: 'asset instance',
	labelPlural: 'asset instances',
	description: 'A concrete asset on a specific network or venue, such as a native coin, token, share, or collectible.',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'kind',
			label: 'kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'assetKey',
			label: 'asset key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'coinId',
			label: 'coin ID',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(CoinId),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'symbol',
			label: 'Symbol',
			description: 'The short ticker or symbol used for display.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'decimals',
			label: 'Decimals',
			description: 'The number of decimal places used to display the amount.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$icon',
			label: 'icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$formats',
			label: 'formats',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AssetFormatSupport_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
