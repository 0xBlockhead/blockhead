// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AcpSessionUpdateSelector {
	SessionSequence = 'SessionSequence',
}
export default {
	entityType: EntityType.AcpSessionUpdate,
	label: 'acp session update',
	labelPlural: 'acp session updates',
	selectors: [
		{
			name: AcpSessionUpdateSelector.SessionSequence,
			fields: [
				'$session',
				'sequence',
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
			name: 'sequence',
			label: 'sequence',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'updateKind',
			label: 'update kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
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
