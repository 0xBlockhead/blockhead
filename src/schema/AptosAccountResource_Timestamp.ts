// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AptosAccountResource_Timestamp,
	labels: {
		singular: 'aptos account resource timestamp',
		plural: 'aptos account resource observations',
	},
})({
	$resource: {
		entityType: EntityType.AptosAccountResource,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerVersion: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ResourceLedgerVersionSource: [
			'$resource',
			'ledgerVersion',
			'source',
		],
	},
})
