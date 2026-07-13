// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmSelector_TimestampSelector {
	SelectorTimestampMsSource = 'SelectorTimestampMsSource',
}
export const EvmSelector_Timestamp = entity({
	entityType: EntityType.EvmSelector_Timestamp,
	labels: {
		singular: 'EVM selector observation',
		plural: 'EVM selector observations',
	},
})({
	$selector: {
		label: 'Selector',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmSelector,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	signatures: {
		label: 'Signatures',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	filteredSignatureCount: {
		label: 'Filtered signature count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedCandidateCount: {
		label: 'Verified candidate count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reachable: {
		label: 'Reachable',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SelectorTimestampMsSource: [
			'$selector',
			'timestampMs',
			'source',
		],
	},
})
