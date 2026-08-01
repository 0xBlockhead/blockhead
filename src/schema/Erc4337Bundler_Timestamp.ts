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
		entityType: EntityType.Erc4337Bundler,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	userOperationsCount: {
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
