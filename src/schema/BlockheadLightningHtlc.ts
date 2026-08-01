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
		label: 'channel state',
		entityType: EntityType.BlockheadLightningChannelState,
		cardinality: EntityFieldCardinality.One,
	},
	htlcIndex: {
		label: 'htlc index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$channel: {
		label: 'channel',
		entityType: EntityType.LightningChannel,
		cardinality: EntityFieldCardinality.One,
	},
	direction: {
		label: 'direction',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountMsat: {
		label: 'amount msat',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expiryHeight: {
		label: 'expiry height',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	hashLock: {
		label: 'hash lock',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	state: {
		label: 'state',
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
