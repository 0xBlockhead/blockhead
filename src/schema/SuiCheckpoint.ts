// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SuiCheckpoint,
	labels: {
		singular: 'sui checkpoint',
		plural: 'sui checkpoints',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	sequence: {
		label: 'sequence',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	digest: {
		label: 'digest',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	epoch: {
		label: 'epoch',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousDigest: {
		label: 'previous digest',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.SuiTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkSequence: [
			'$network',
			'sequence',
		],
		NetworkDigest: [
			'$network',
			'digest',
		],
	},
})
