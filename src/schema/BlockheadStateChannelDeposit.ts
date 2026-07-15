// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadStateChannelDepositSelector {
	ChannelAccount = 'ChannelAccount',
}
export const BlockheadStateChannelDeposit = entity({
	entityType: EntityType.BlockheadStateChannelDeposit,
	labels: {
		singular: 'blockhead state channel deposit',
		plural: 'blockhead state channel deposits',
	},
})({
	$channel: {
		label: 'channel',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadStateChannel,
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
