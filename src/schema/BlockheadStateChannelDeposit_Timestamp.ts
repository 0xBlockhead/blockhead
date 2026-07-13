// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadStateChannelDeposit_TimestampSelector {
	DepositTimestampMsSource = 'DepositTimestampMsSource',
}
export const BlockheadStateChannelDeposit_Timestamp = entity({
	entityType: EntityType.BlockheadStateChannelDeposit_Timestamp,
	labels: {
		singular: 'blockhead state channel deposit timestamp',
		plural: 'blockhead state channel deposit observations',
	},
})({
	$deposit: {
		label: 'deposit',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadStateChannelDeposit,
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
	availableBalance: {
		label: 'available balance',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	lockedBalance: {
		label: 'locked balance',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		DepositTimestampMsSource: [
			'$deposit',
			'timestampMs',
			'source',
		],
	},
})
