// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TonJetton,
	labels: {
		singular: 'ton jetton',
		plural: 'ton jettons',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	masterAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$masterAccount: {
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$balanceTimestamps: {
		entityType: EntityType.TonJettonBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transfers: {
		entityType: EntityType.TonJettonTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.TonJetton_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkMasterAddress: [
			'$network',
			'masterAddress',
		],
	},
})
