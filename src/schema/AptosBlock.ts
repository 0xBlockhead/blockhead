// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AptosBlock,
	labels: {
		singular: 'aptos block',
		plural: 'aptos blocks',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.AptosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	height: {
		label: 'Height',
		description: 'The block or ledger height in its network.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	version: {
		label: 'lookup version',
		description: 'A ledger version used to locate the canonical block that contains it.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	firstVersion: {
		label: 'first version',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	lastVersion: {
		label: 'last version',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The block timestamp in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.AptosTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkHeight: [
			'$network',
			'height',
		],
		NetworkVersion: [
			'$network',
			'version',
		],
	},
})
