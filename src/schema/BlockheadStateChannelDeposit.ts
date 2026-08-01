// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadStateChannelDeposit,
	labels: {
		singular: 'blockhead state channel deposit',
		plural: 'blockhead state channel deposits',
	},
})({
	$channel: {
		entityType: EntityType.BlockheadStateChannel,
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.BlockheadStateChannelDeposit_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ChannelAccount: [
			'$channel',
			'$account',
		],
	},
})
