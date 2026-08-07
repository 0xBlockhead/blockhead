// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.PolkadotAccount,
	labels: {
		singular: 'Polkadot account',
		plural: 'Polkadot accounts',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	accountId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.PolkadotAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
	$$assetBalanceTimestamps: {
		entityType: EntityType.PolkadotAssetBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
})({
	selectors: {
		NetworkAccountId: [
			'$network',
			'accountId',
		],
	},
})
