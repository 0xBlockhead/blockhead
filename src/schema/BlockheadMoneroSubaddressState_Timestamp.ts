// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadMoneroSubaddressState_Timestamp,
	labels: {
		singular: 'blockhead monero subaddress state timestamp',
		plural: 'blockhead monero subaddress state observations',
	},
})({
	$subaddressState: {
		label: 'subaddress state',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadMoneroSubaddressState,
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
	used: {
		label: 'used',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	balanceAtomicUnits: {
		label: 'balance atomic units',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	unlockedBalanceAtomicUnits: {
		label: 'unlocked balance atomic units',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	numUnspentOutputs: {
		label: 'num unspent outputs',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blocksToUnlock: {
		label: 'blocks to unlock',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timeToUnlockSeconds: {
		label: 'time to unlock seconds',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastSyncedAt: {
		label: 'last synced AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SubaddressStateTimestampMsSource: [
			'$subaddressState',
			'timestampMs',
			'source',
		],
	},
})
