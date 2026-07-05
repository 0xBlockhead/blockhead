// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadQuilibriumAccountState_TimestampSelector {
	AccountStateTimestampMsSource = 'AccountStateTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadQuilibriumAccountState_Timestamp,
	label: 'blockhead quilibrium account state timestamp',
	labelPlural: 'blockhead quilibrium account state observations',
	selectors: [
		{
			name: BlockheadQuilibriumAccountState_TimestampSelector.AccountStateTimestampMsSource,
			fields: [
				'$accountState',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$accountState',
				label: 'account state',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadQuilibriumAccountState,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'balance',
				label: 'balance',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'balanceObservedAt',
				label: 'balance observed AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
