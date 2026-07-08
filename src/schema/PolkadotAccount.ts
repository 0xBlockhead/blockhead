// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum PolkadotAccountSelector {
	NetworkAccountId = 'NetworkAccountId',
}
export const PolkadotAccount = entity({
	entityType: EntityType.PolkadotAccount,
	label: 'Polkadot account',
	labelPlural: 'Polkadot accounts',
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	accountId: {
		label: 'Account ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Account snapshots',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.PolkadotAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
	$$assetBalanceTimestamps: {
		label: 'Asset balance observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.PolkadotAssetBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAccountId: [
			'$network',
			'accountId',
		],
	},
})
