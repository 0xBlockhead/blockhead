// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RssItem_TimestampSelector {
	ItemTimestampMsSource = 'ItemTimestampMsSource',
}
export default {
	entityType: EntityType.RssItem_Timestamp,
	label: 'RSS item observation',
	labelPlural: 'RSS item observations',
	selectors: [
		{
			name: RssItem_TimestampSelector.ItemTimestampMsSource,
			fields: [
				'$item',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$item',
			label: 'Item',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RssItem,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'title',
			label: 'Title',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'link',
			label: 'Link',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'publishedAt',
			label: 'Published',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
