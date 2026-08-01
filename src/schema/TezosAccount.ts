// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosAccount,
	labels: {
		singular: 'tezos account',
		plural: 'tezos accounts',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountKind: {
		label: 'account kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$operations: {
		label: 'operations',
		entityType: EntityType.TezosOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenBalanceTimestamps: {
		label: 'token balance timestamps',
		entityType: EntityType.TezosTokenBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenTransfers: {
		label: 'token transfers',
		entityType: EntityType.TezosTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.TezosAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAddress: [
			'$network',
			'address',
		],
	},
})
