// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadLightningForward,
	labels: {
		singular: 'local LND forward',
		plural: 'local LND forwards',
	},
	description: 'A completed HTLC forward from the configured local LND node\'s switch history. It is keyed by incoming channel and HTLC id and requires both incoming and outgoing HTLC ids.',
})({
	$localNodeState: {
		entityType: EntityType.BlockheadLightningNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	$incomingChannel: {
		entityType: EntityType.LightningChannel,
		cardinality: EntityFieldCardinality.One,
	},
	incomingHtlcId: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	$outgoingChannel: {
		entityType: EntityType.LightningChannel,
		cardinality: EntityFieldCardinality.One,
	},
	outgoingHtlcId: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	incomingMsat: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	outgoingMsat: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	feeMsat: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	completionTimestampNs: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		LocalNodeStateIncomingChannelIncomingHtlcId: [
			'$localNodeState',
			'$incomingChannel',
			'incomingHtlcId',
		],
	},
})
