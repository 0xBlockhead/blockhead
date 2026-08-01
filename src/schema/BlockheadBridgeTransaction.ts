// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadBridgeTransaction,
	labels: {
		singular: 'bridge transaction',
		plural: 'bridge transactions',
	},
})({
	$account: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$sourceTx: {
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$bridgeTransfer: {
		entityType: EntityType.BridgeTransfer,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountSourceTxCreatedAt: [
			'$account',
			'$sourceTx',
			'createdAt',
		],
	},
})
