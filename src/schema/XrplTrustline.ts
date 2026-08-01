// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XrplTrustline,
	labels: {
		singular: 'xrpl trustline',
		plural: 'xrpl trustlines',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	account: {
		label: 'account',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	currency: {
		label: 'currency',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	issuer: {
		label: 'issuer',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		label: 'account',
		entityType: EntityType.XrplAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$issuerAccount: {
		label: 'issuer account',
		entityType: EntityType.XrplAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.XrplTrustline_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAccountCurrencyIssuer: [
			'$network',
			'account',
			'currency',
			'issuer',
		],
	},
})
