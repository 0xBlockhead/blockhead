// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XrplAmm,
	labels: {
		singular: 'xrpl amm',
		plural: 'xrpl amms',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	ammAccount: {
		label: 'amm account',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetCurrency: {
		label: 'asset currency',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetIssuer: {
		label: 'asset issuer',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	asset2Currency: {
		label: 'asset2 currency',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	asset2Issuer: {
		label: 'asset2 issuer',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lpTokenCurrency: {
		label: 'lp token currency',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.XrplAmm_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAmmAccount: [
			'$network',
			'ammAccount',
		],
	},
})
