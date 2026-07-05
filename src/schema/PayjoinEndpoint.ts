// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PayjoinEndpointSelector {
	EndpointUrl = 'EndpointUrl',
}
export default {
	entityType: EntityType.PayjoinEndpoint,
	label: 'payjoin endpoint',
	labelPlural: 'payjoin endpoints',
	selectors: [
		{
			name: PayjoinEndpointSelector.EndpointUrl,
			fields: [
				'endpointUrl',
			],
		},
	],
	fields: [
		{
				name: 'endpointUrl',
				label: 'endpoint URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'protocolVersion',
				label: 'protocol version',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$directory',
				label: 'directory',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.PayjoinDirectory,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.PayjoinEndpoint_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$blockheadSessions',
				label: 'blockhead sessions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadPayjoinSession,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
