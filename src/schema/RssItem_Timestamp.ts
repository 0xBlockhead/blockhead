// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RssItem_TimestampSelector {
	ItemTimestampMsSource = 'ItemTimestampMsSource',
}
export const RssItem_Timestamp = entity({
	entityType: EntityType.RssItem_Timestamp,
	labels: {
		singular: 'RSS item observation',
		plural: 'RSS item observations',
	},
})({
	$item: {
		label: 'Item',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RssItem,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	observed: {
		label: 'Observed',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	reachable: {
		label: 'Feed reachable',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	fetchWindowKind: {
		label: 'Fetch window',
		type: EntityFieldType.Primitive,
		primitiveType: type.unit('Feed'),
		cardinality: EntityFieldCardinality.One,
	},
	error: {
		label: 'Error',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ItemTimestampMsSource: [
			'$item',
			'timestampMs',
			'source',
		],
	},
})
