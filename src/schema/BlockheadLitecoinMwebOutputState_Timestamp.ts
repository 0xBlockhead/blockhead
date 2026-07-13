// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadLitecoinMwebOutputState_TimestampSelector {
	OutputStateTimestampMsSource = 'OutputStateTimestampMsSource',
}
export const BlockheadLitecoinMwebOutputState_Timestamp = entity({
	entityType: EntityType.BlockheadLitecoinMwebOutputState_Timestamp,
	labels: {
		singular: 'blockhead litecoin mweb output state timestamp',
		plural: 'blockhead litecoin mweb output state observations',
	},
})({
	$outputState: {
		label: 'output state',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadLitecoinMwebOutputState,
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
	spent: {
		label: 'spent',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spendTransactionId: {
		label: 'spend transaction ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	receivedAtHeight: {
		label: 'received AT height',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spentAtHeight: {
		label: 'spent AT height',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	confirmations: {
		label: 'confirmations',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastScannedAt: {
		label: 'last scanned AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		OutputStateTimestampMsSource: [
			'$outputState',
			'timestampMs',
			'source',
		],
	},
})
