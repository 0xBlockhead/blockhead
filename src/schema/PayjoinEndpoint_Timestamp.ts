// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PayjoinEndpoint_TimestampSelector {
	EndpointTimestampMsSource = 'EndpointTimestampMsSource',
}
export const PayjoinEndpoint_Timestamp = entity({
	entityType: EntityType.PayjoinEndpoint_Timestamp,
	label: 'payjoin endpoint timestamp',
	labelPlural: 'payjoin endpoint observations',
})({
	$endpoint: {
		label: 'endpoint',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.PayjoinEndpoint,
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
	supportsOutputSubstitution: {
		label: 'supports output substitution',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requiresOhttp: {
		label: 'requires ohttp',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maxPayloadBytes: {
		label: 'max payload bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastSeenAt: {
		label: 'last seen AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseStatus: {
		label: 'response status',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EndpointTimestampMsSource: [
			'$endpoint',
			'timestampMs',
			'source',
		],
	},
})
