// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	masterAddress: {
		label: 'master address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$masterAccount: {
		label: 'master account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$balanceTimestamps: {
		label: 'balance timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonJettonBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transfers: {
		label: 'transfers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonJettonTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
