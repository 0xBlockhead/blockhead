// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadSourceEndpoint,
	labels: {
		singular: 'source endpoint',
		plural: 'source endpoints',
	},
	description: 'One concrete executable endpoint belonging to a registered source binding.',
})({
	$source: {
		entityType: EntityType.BlockheadSource,
		cardinality: EntityFieldCardinality.One,
	},
	bindingId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	endpointIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	endpointUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	targetKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	targetKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	wireProtocol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	apiFamily: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	delivery: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	corsEnabled: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.BlockheadSourceEndpoint_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
})({
	selectors: {
		SourceBindingIdEndpointIndex: [
			'$source',
			'bindingId',
			'endpointIndex',
		],
	},
})
