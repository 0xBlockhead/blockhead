// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadZcashViewingKey_TimestampSelector {
	ViewingKeyTimestampMsSource = 'ViewingKeyTimestampMsSource',
}
export const BlockheadZcashViewingKey_Timestamp = entity({
	entityType: EntityType.BlockheadZcashViewingKey_Timestamp,
	label: 'blockhead zcash viewing key timestamp',
	labelPlural: 'blockhead zcash viewing key observations',
})({
	$viewingKey: {
		label: 'viewing key',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadZcashViewingKey,
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
	lastScannedHeight: {
		label: 'last scanned height',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastScannedAt: {
		label: 'last scanned AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	notesDiscovered: {
		label: 'notes discovered',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nullifiersMatched: {
		label: 'nullifiers matched',
		type: EntityFieldType.Primitive,
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
