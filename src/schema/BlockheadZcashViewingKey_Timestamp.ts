// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadZcashViewingKey_Timestamp,
	labels: {
		singular: 'blockhead zcash viewing key timestamp',
		plural: 'blockhead zcash viewing key observations',
	},
})({
	$viewingKey: {
		label: 'viewing key',
		entityType: EntityType.BlockheadZcashViewingKey,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	lastScannedHeight: {
		label: 'last scanned height',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastScannedAt: {
		label: 'last scanned AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	notesDiscovered: {
		label: 'notes discovered',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nullifiersMatched: {
		label: 'nullifiers matched',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ViewingKeyTimestampMsSource: [
			'$viewingKey',
			'timestampMs',
			'source',
		],
	},
})
