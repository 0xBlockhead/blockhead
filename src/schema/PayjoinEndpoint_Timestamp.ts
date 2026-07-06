// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PayjoinEndpoint_TimestampSelector {
	EndpointTimestampMsSource = 'EndpointTimestampMsSource',
}
export default {
	entityType: EntityType.PayjoinEndpoint_Timestamp,
	label: 'payjoin endpoint timestamp',
	labelPlural: 'payjoin endpoint observations',
	selectors: [
		{
			name: PayjoinEndpoint_TimestampSelector.EndpointTimestampMsSource,
			fields: [
				'$endpoint',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$endpoint',
			label: 'endpoint',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PayjoinEndpoint,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'supportsOutputSubstitution',
			label: 'supports output substitution',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'requiresOhttp',
			label: 'requires ohttp',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maxPayloadBytes',
			label: 'max payload bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastSeenAt',
			label: 'last seen AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'responseStatus',
			label: 'response status',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'error',
			label: 'error',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
