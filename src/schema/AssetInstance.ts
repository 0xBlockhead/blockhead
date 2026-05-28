import { type } from 'arktype'
import { CoinId } from '$/constants/Coin.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/$Source.ts'

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

	id: type({
		$network: Network.id,
		kind: type.valueOf(AssetInstanceKind),
		assetKey: 'string',
	}),

	fields: [
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
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
