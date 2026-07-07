// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum PolkadotAccountSelector {
	NetworkAccountId = 'NetworkAccountId',
}
export default {
	entityType: EntityType.PolkadotAccount,
	label: 'Polkadot account',
	labelPlural: 'Polkadot accounts',
	selectors: [
		{
			name: PolkadotAccountSelector.NetworkAccountId,
			fields: [
				'$network',
				'accountId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'accountId',
			label: 'Account ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'Account snapshots',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotAccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.SubstrateSidecar_Rest,
			],
		},
		{
			name: '$$assetBalanceTimestamps',
			label: 'Asset balance observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotAssetBalance_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
