// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AcpTerminal_TimestampSelector {
	TerminalTimestampMsSource = 'TerminalTimestampMsSource',
}
export default {
	entityType: EntityType.AcpTerminal_Timestamp,
	label: 'acp terminal timestamp',
	labelPlural: 'acp terminal observations',
	selectors: [
		{
			name: AcpTerminal_TimestampSelector.TerminalTimestampMsSource,
			fields: [
				'$terminal',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$terminal',
				label: 'terminal',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AcpTerminal,
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
				name: 'exitCode',
				label: 'exit code',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
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
				name: 'outputBytes',
				label: 'output bytes',
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
