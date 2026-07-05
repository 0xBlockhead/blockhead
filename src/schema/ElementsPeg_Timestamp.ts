// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ElementsPeg_TimestampSelector {
	PegTimestampMsSource = 'PegTimestampMsSource',
}
export default {
	entityType: EntityType.ElementsPeg_Timestamp,
	label: 'Elements peg observation',
	labelPlural: 'Elements peg observations',
	selectors: [
		{
			name: ElementsPeg_TimestampSelector.PegTimestampMsSource,
			fields: [
				'$peg',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$peg',
				label: 'Peg',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.ElementsPeg,
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
				name: 'status',
				label: 'Status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'confirmations',
				label: 'Confirmations',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'observedBitcoinHeight',
				label: 'Observed Bitcoin height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'observedElementsHeight',
				label: 'Observed Elements height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
