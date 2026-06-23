import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ElementsAssetSelector {
	ElementsNetworkAssetId = 'elementsNetworkAssetId',
	NetworkAssetId = '$network+assetId',
}
export default {
	entityType: EntityType.ElementsAsset,
	label: 'elements asset',
	labelPlural: 'elements assets',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ElementsNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'assetId',
			label: 'asset ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ticker',
			label: 'ticker',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'precision',
			label: 'precision',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'entityDomain',
			label: 'entity domain',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'contractJson',
			label: 'contract JSON',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'hasBlindedIssuances',
			label: 'has blinded issuances',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$issuances',
			label: 'issuances',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ElementsIssuance,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ElementsAsset_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
