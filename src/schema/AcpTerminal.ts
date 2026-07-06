// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AcpTerminalSelector {
	SessionTerminalId = 'SessionTerminalId',
}
export default {
	entityType: EntityType.AcpTerminal,
	label: 'acp terminal',
	labelPlural: 'acp terminals',
	selectors: [
		{
			name: AcpTerminalSelector.SessionTerminalId,
			fields: [
				'$session',
				'terminalId',
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
			name: 'terminalId',
			label: 'terminal ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'command',
			label: 'command',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'cwd',
			label: 'cwd',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
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
			name: 'releasedAt',
			label: 'released AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AcpTerminal_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
