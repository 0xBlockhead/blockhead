// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmSelector_Timestamp,
	labels: {
		singular: 'EVM selector observation',
		plural: 'EVM selector observations',
	},
})({
	$selector: {
		label: 'Selector',
		entityType: EntityType.EvmSelector,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	signatures: {
		label: 'Signatures',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	filteredSignatureCount: {
		label: 'Filtered signature count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedCandidateCount: {
		label: 'Verified candidate count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reachable: {
		label: 'Reachable',
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
