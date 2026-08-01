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
		label: 'Account',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$sourceTx: {
		label: 'Source transaction',
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		label: 'Created',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$bridgeTransfer: {
		label: 'Bridge transfer',
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
