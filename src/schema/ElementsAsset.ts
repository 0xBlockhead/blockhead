import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum ElementsAssetSelector {
	ElementsNetworkAssetId = 'elementsNetworkAssetId',
}

export default {
	entityType: EntityType.ElementsAsset,

	label: 'Elements asset',
	labelPlural: 'Elements assets',

	selectors: [
		{
			name: ElementsAssetSelector.ElementsNetworkAssetId,
			fields: [
				'$network',
				'assetId',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ElementsNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'assetId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'ticker',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'precision',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'entityDomain',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'contractJson',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'issuedAmount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'burnedAmount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'hasBlindedIssuances',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: 'reissuanceTokenCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
		{
			name: '$$issuances',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ElementsIssuance,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
