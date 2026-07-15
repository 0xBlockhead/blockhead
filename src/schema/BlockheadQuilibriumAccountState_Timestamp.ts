// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadQuilibriumAccountState_TimestampSelector {
	AccountStateTimestampMsSource = 'AccountStateTimestampMsSource',
}
export const BlockheadQuilibriumAccountState_Timestamp = entity({
	entityType: EntityType.BlockheadQuilibriumAccountState_Timestamp,
	labels: {
		singular: 'blockhead quilibrium account state timestamp',
		plural: 'blockhead quilibrium account state observations',
	},
})({
	$accountState: {
		label: 'account state',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadQuilibriumAccountState,
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
	balance: {
		label: 'balance',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	balanceObservedAt: {
		label: 'balance observed AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountStateTimestampMsSource: [
			'$accountState',
			'timestampMs',
			'source',
		],
	},
})
