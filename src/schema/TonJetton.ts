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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	masterAddress: {
		label: 'master address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$masterAccount: {
		label: 'master account',
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$balanceTimestamps: {
		label: 'balance timestamps',
		entityType: EntityType.TonJettonBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transfers: {
		label: 'transfers',
		entityType: EntityType.TonJettonTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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
