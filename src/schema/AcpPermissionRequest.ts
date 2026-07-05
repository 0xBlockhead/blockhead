// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AcpPermissionRequestSelector {
	SessionRequestId = 'SessionRequestId',
}
export default {
	entityType: EntityType.AcpPermissionRequest,
	label: 'acp permission request',
	labelPlural: 'acp permission requests',
	selectors: [
		{
			name: AcpPermissionRequestSelector.SessionRequestId,
			fields: [
				'$session',
				'requestId',
			],
		},
	],
	fields: [
		{
				name: '$session',
				label: 'session',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AcpSession,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'requestId',
				label: 'request ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'requestKind',
				label: 'request kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'createdAt',
				label: 'Created',
				description: 'The time when the subject was created according to the source.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'resolvedAt',
				label: 'resolved AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'decision',
				label: 'decision',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'payload',
				label: 'payload',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
