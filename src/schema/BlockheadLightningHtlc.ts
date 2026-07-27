// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadLightningChannelState,
		cardinality: EntityFieldCardinality.One,
	},
	htlcIndex: {
		label: 'htlc index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$channel: {
		label: 'channel',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LightningChannel,
		cardinality: EntityFieldCardinality.One,
	},
	direction: {
		label: 'direction',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountMsat: {
		label: 'amount msat',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expiryHeight: {
		label: 'expiry height',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	hashLock: {
		label: 'hash lock',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	state: {
		label: 'state',
		type: EntityFieldType.Primitive,
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
