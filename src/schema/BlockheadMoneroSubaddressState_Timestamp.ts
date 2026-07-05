// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadMoneroSubaddressState_TimestampSelector {
	SubaddressStateTimestampMsSource = 'SubaddressStateTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadMoneroSubaddressState_Timestamp,
	label: 'blockhead monero subaddress state timestamp',
	labelPlural: 'blockhead monero subaddress state observations',
	selectors: [
		{
			name: BlockheadMoneroSubaddressState_TimestampSelector.SubaddressStateTimestampMsSource,
			fields: [
				'$subaddressState',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$subaddressState',
				label: 'subaddress state',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadMoneroSubaddressState,
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
				name: 'used',
				label: 'used',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'balanceAtomicUnits',
				label: 'balance atomic units',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'unlockedBalanceAtomicUnits',
				label: 'unlocked balance atomic units',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'numUnspentOutputs',
				label: 'num unspent outputs',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'blocksToUnlock',
				label: 'blocks to unlock',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'timeToUnlockSeconds',
				label: 'time to unlock seconds',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'lastSyncedAt',
				label: 'last synced AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
