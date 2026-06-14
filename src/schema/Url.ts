import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'

export enum UrlSelector {
	Url = 'url',
}



export default {
	entityType: EntityType.Url,

	label: 'URL',
	labelPlural: 'URLs',

	selectors: [
		{
			name: UrlSelector.Url,
			fields: [
				'url',
			],
		},
	],

	fields: [
		{
			name: 'url',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'catalogName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
				Source.Lifi_Rest,
				Source.Constants_Internal,
			],
		},
		{
			name: 'catalogStandard',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
				Source.Lifi_Rest,
				Source.Constants_Internal,
			],
		},
		{
			name: 'catalogIcon',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
				Source.Lifi_Rest,
				Source.Constants_Internal,
			],
		},
		{
			name: 'openGraphTitle',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MetadataVision_Rest,
			],
		},
		{
			name: 'openGraphDescription',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MetadataVision_Rest,
			],
		},
		{
			name: 'publisher',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MetadataVision_Rest,
			],
		},
		{
			name: '$siteIcon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MetadataVision_Rest,
			],
		},
		{
			name: '$openGraphImage',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MetadataVision_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
