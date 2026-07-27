// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountKind: {
		label: 'account kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$operations: {
		label: 'operations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenBalanceTimestamps: {
		label: 'token balance timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosTokenBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenTransfers: {
		label: 'token transfers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
