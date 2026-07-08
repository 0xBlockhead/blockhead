// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadMoneroTransferState_TimestampSelector {
	TransferStateTimestampMsSource = 'TransferStateTimestampMsSource',
}
export const BlockheadMoneroTransferState_Timestamp = entity({
	entityType: EntityType.BlockheadMoneroTransferState_Timestamp,
	label: 'blockhead monero transfer state timestamp',
	labelPlural: 'blockhead monero transfer state observations',
})({
	$transferState: {
		label: 'transfer state',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadMoneroTransferState,
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
	confirmations: {
		label: 'confirmations',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	unlockTime: {
		label: 'unlock time',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spent: {
		label: 'spent',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastCheckedAt: {
		label: 'last checked AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransferStateTimestampMsSource: [
			'$transferState',
			'timestampMs',
			'source',
		],
	},
})
