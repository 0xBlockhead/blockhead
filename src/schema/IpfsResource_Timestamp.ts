// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IpfsResource_Timestamp,
	labels: {
		singular: 'IPFS resource capture',
		plural: 'IPFS resource captures',
	},
})({
	$resource: {
		entityType: EntityType.IpfsResource,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	gatewayOrigin: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	gatewayUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	fileName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	extension: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentLength: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	displayType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	isContentTypeInferred: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	text: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$media: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ResourceTimestampMsSource: [
			'$resource',
			'timestampMs',
			'source',
		],
	},
})
