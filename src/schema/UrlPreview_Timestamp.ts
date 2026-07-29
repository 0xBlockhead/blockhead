// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.UrlPreview_Timestamp,
	labels: {
		singular: 'URL preview timestamp',
		plural: 'URL preview observations',
	},
})({
	$url: {
		label: 'URL',
		description: 'The URL for the source-domain resource.',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Url,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		label: 'Title',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	siteName: {
		label: 'Site name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	imageUrl: {
		label: 'Image URL',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$image: {
		label: 'Image',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previewStatus: {
		label: 'Preview status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		UrlTimestampMsSource: [
			'$url',
			'timestampMs',
			'source',
		],
	},
})
