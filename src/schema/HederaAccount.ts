// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	accountId: {
		label: 'account ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$allowances: {
		label: 'allowances',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaAllowance,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.HederaMirrorNode_Rest,
		],
	},
	$$tokens: {
		label: 'tokens',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaTokenAssociation,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.HederaMirrorNode_Rest,
		],
	},
	$$nfts: {
		label: 'nfts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaNft,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.HederaMirrorNode_Rest,
		],
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.HederaMirrorNode_Rest,
		],
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
