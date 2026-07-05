// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadStateChannelDepositSelector {
	ChannelAccount = 'ChannelAccount',
}
export default {
	entityType: EntityType.BlockheadStateChannelDeposit,
	label: 'blockhead state channel deposit',
	labelPlural: 'blockhead state channel deposits',
	selectors: [
		{
			name: BlockheadStateChannelDepositSelector.ChannelAccount,
			fields: [
				'$channel',
				'$account',
			],
		},
	],
	fields: [
		{
				name: '$channel',
				label: 'channel',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadStateChannel,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$account',
				label: 'account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadStateChannelDeposit_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
