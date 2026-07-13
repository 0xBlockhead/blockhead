// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ElementsAsset_TimestampSelector {
	AssetTimestampMsSource = 'AssetTimestampMsSource',
}
export const ElementsAsset_Timestamp = entity({
	entityType: EntityType.ElementsAsset_Timestamp,
	labels: {
		singular: 'Elements asset observation',
		plural: 'Elements asset observations',
	},
})({
	$asset: {
		label: 'Asset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ElementsAsset,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	issuedAmount: {
		label: 'Issued amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	burnedAmount: {
		label: 'Burned amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reissuanceTokenCount: {
		label: 'Reissuance tokens',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AssetTimestampMsSource: [
			'$asset',
			'timestampMs',
			'source',
		],
	},
})
