// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadLightningHtlc,
	labels: {
		singular: 'blockhead Lightning htlc',
		plural: 'blockhead Lightning htlcs',
	},
})({
	$channelState: {
		entityType: EntityType.BlockheadLightningChannelState,
		cardinality: EntityFieldCardinality.One,
	},
	htlcIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$channel: {
		entityType: EntityType.LightningChannel,
		cardinality: EntityFieldCardinality.One,
	},
	direction: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountMsat: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expiryHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	hashLock: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	state: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ChannelStateHtlcIndex: [
			'$channelState',
			'htlcIndex',
		],
	},
})
