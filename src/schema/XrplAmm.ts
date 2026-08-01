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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	ammAccount: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetCurrency: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetIssuer: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	asset2Currency: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	asset2Issuer: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lpTokenCurrency: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
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
