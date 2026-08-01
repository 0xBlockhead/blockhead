// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SwarmResource,
	labels: {
		singular: 'Swarm resource',
		plural: 'Swarm resources',
	},
})({
	reference: {
		label: 'Reference',
		description: 'The namespace-specific reference value.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	contentPath: {
		label: 'Content path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	canonicalUri: {
		label: 'Canonical URI',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	gatewayOrigin: {
		label: 'Gateway origin',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	gatewayUrl: {
		label: 'Gateway URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	fileName: {
		label: 'File name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	extension: {
		label: 'Extension',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentType: {
		label: 'Content type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentLength: {
		label: 'Content length',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	displayType: {
		label: 'Display type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	isContentTypeInferred: {
		label: 'Content type inferred',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	text: {
		label: 'Text',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$media: {
		label: 'Media',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ResourceAddress: [
			'reference',
			'contentPath',
		],
	},
})
