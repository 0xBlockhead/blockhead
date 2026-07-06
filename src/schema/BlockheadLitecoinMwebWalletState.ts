// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadLitecoinMwebWalletStateSelector {
	WalletIdNetwork = 'WalletIdNetwork',
}
export default {
	entityType: EntityType.BlockheadLitecoinMwebWalletState,
	label: 'blockhead litecoin mweb wallet state',
	labelPlural: 'blockhead litecoin mweb wallet states',
	selectors: [
		{
			name: BlockheadLitecoinMwebWalletStateSelector.WalletIdNetwork,
			fields: [
				'walletId',
				'$network',
			],
		},
	],
	fields: [
		{
			name: 'walletId',
			label: 'wallet ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$wallet',
			label: 'wallet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadWallet,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$outputs',
			label: 'outputs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadLitecoinMwebOutputState,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadLitecoinMwebWalletState_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
