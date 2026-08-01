// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

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
		defaultSources: [
			Source.HederaMirrorNode_Rest,
		],
	},
	$$tokens: {
		entityType: EntityType.HederaTokenAssociation,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.HederaMirrorNode_Rest,
		],
	},
	$$nfts: {
		entityType: EntityType.HederaNft,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.HederaMirrorNode_Rest,
		],
	},
	$$transactions: {
		entityType: EntityType.HederaTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.HederaMirrorNode_Rest,
		],
	},
	$$timestamps: {
		entityType: EntityType.HederaAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.HederaMirrorNode_Rest,
		],
	},
})({
	selectors: {
		NetworkAccountId: [
			'$network',
			'accountId',
		],
	},
})
