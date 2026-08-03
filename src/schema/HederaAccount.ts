// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const hederaMirrorNodeRestSources = [
	Source.HederaMirrorNode_Rest,
] as const

export default entity({
	entityType: EntityType.HederaAccount,
	labels: {
		singular: 'hedera account',
		plural: 'hedera accounts',
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
	$$allowances: {
		entityType: EntityType.HederaAllowance,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: hederaMirrorNodeRestSources,
	},
	$$tokens: {
		entityType: EntityType.HederaTokenAssociation,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: hederaMirrorNodeRestSources,
	},
	$$nfts: {
		entityType: EntityType.HederaNft,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: hederaMirrorNodeRestSources,
	},
	$$transactions: {
		entityType: EntityType.HederaTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: hederaMirrorNodeRestSources,
	},
	$$timestamps: {
		entityType: EntityType.HederaAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: hederaMirrorNodeRestSources,
	},
})({
	selectors: {
		NetworkAccountId: [
			'$network',
			'accountId',
		],
	},
})
