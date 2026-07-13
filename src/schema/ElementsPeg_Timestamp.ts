// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ElementsPeg_TimestampSelector {
	PegTimestampMsSource = 'PegTimestampMsSource',
}
export const ElementsPeg_Timestamp = entity({
	entityType: EntityType.ElementsPeg_Timestamp,
	labels: {
		singular: 'Elements peg observation',
		plural: 'Elements peg observations',
	},
})({
	$peg: {
		label: 'Peg',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ElementsPeg,
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
	status: {
		label: 'Status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	confirmations: {
		label: 'Confirmations',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	observedBitcoinHeight: {
		label: 'Observed Bitcoin height',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	observedElementsHeight: {
		label: 'Observed Elements height',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		PegTimestampMsSource: [
			'$peg',
			'timestampMs',
			'source',
		],
	},
})
