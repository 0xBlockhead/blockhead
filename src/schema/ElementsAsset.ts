// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum ElementsAssetSelector {
	ElementsNetworkAssetId = 'ElementsNetworkAssetId',
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
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.ElementsNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'assetId',
				label: 'Asset ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'name',
				label: 'Name',
				description: 'The human-readable name of the subject.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ticker',
				label: 'Ticker',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'precision',
				label: 'Precision',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'entityDomain',
				label: 'Entity domain',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'contractJson',
				label: 'Contract JSON',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'hasBlindedIssuances',
				label: 'Has blinded issuances',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$issuances',
				label: 'Issuances',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ElementsIssuance,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ElementsAsset_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Esplora_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
