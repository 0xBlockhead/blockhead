import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum TronTokenSelector {
	NetworkTokenId = 'networkTokenId',
}
import { Source } from '$/sources/Source.ts'

export enum TronTokenStandard {
	Trc10 = 'TRC-10',
	Trc20 = 'TRC-20',
	Trc721 = 'TRC-721',
	Trc1155 = 'TRC-1155',
}

const tronScanRestSources = [
	Source.TronScan_Rest,
]

export default {
	entityType: EntityType.TronToken,

	label: 'TRON Token',
	labelPlural: 'TRON Tokens',

	selectors: [
		{
			name: TronTokenSelector.NetworkTokenId,
			fields: [
				'$network',
				'tokenId',
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
			name: 'tokenId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'standard',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(TronTokenStandard),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: 'symbol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: 'decimals',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: 'totalSupply',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: '$owner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: '$contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: 'createdTimestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: 'holderCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
