// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum AcpSessionSelector {
	SessionId = 'SessionId',
}
export default {
	entityType: EntityType.AcpSession,
	label: 'acp session',
	labelPlural: 'acp sessions',
	selectors: [
		{
			name: AcpSessionSelector.SessionId,
			fields: [
				'sessionId',
			],
		},
	],
	fields: [
		{
				name: 'sessionId',
				label: 'session ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$runtime',
				label: 'runtime',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AcpAgentRuntime,
				cardinality: EntityFieldCardinality.ZeroOrOne,
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
				name: 'closedAt',
				label: 'closed AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'deletedAt',
				label: 'deleted AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'loadedFromSessionId',
				label: 'loaded from session ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'workspaceUri',
				label: 'workspace URI',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'mode',
				label: 'mode',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'listed',
				label: 'listed',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'status',
				label: 'status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$promptTurns',
				label: 'prompt turns',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AcpPromptTurn,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
