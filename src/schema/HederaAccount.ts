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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	accountId: {
		label: 'account ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$allowances: {
		label: 'allowances',
		entityType: EntityType.HederaAllowance,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.HederaMirrorNode_Rest,
		],
	},
	$$tokens: {
		label: 'tokens',
		entityType: EntityType.HederaTokenAssociation,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.HederaMirrorNode_Rest,
		],
	},
	$$nfts: {
		label: 'nfts',
		entityType: EntityType.HederaNft,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.HederaMirrorNode_Rest,
		],
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.HederaTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.HederaMirrorNode_Rest,
		],
	},
	$$timestamps: {
		label: 'timestamps',
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
