// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosAccount,
	labels: {
		singular: 'tezos account',
		plural: 'tezos accounts',
	},
})({
	$network: {
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$operations: {
		entityType: EntityType.TezosOperation,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Tzkt_Rest,
		],
	},
	$$tokenBalanceTimestamps: {
		entityType: EntityType.TezosTokenBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Tzkt_Rest,
			Source.TezosDappetizer_Postgres,
		],
	},
	$$tokenTransfers: {
		entityType: EntityType.TezosTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Tzkt_Rest,
			Source.TezosDappetizer_Postgres,
		],
	},
	$$timestamps: {
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
