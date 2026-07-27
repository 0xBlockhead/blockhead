// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadAgentConnection,
	labels: {
		singular: 'blockhead agent connection',
		plural: 'blockhead agent connections',
	},
})({
	connectionId: {
		label: 'connection ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$profile: {
		label: 'profile',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadAgentProfile,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadSource,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	connectionKind: {
		label: 'connection kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endpointUrl: {
		label: 'endpoint URL',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authKind: {
		label: 'auth kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	enabled: {
		label: 'enabled',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadAgentConnection_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ConnectionId: [
			'connectionId',
		],
	},
})
