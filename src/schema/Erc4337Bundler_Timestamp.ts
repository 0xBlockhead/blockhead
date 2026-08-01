// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Erc4337Bundler_Timestamp,
	labels: {
		singular: 'ERC-4337 bundler timestamp',
		plural: 'ERC-4337 bundler observations',
	},
})({
	$bundler: {
		label: 'Bundler',
		entityType: EntityType.Erc4337Bundler,
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
	userOperationsCount: {
		label: 'User operations',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		BundlerTimestampMsSource: [
			'$bundler',
			'timestampMs',
			'source',
		],
	},
})
