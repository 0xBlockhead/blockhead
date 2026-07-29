// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$sourceTx: {
		label: 'Source transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		label: 'Created',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$bridgeTransfer: {
		label: 'Bridge transfer',
		type: EntityFieldType.EntityReference,
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
