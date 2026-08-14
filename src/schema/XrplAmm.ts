// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
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
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
			Source.Bithomp,
		],
	},
	assetIssuer: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
			Source.Bithomp,
		],
	},
	asset2Currency: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
			Source.Bithomp,
		],
	},
	asset2Issuer: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
			Source.Bithomp,
		],
	},
	lpTokenCurrency: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
			Source.Bithomp,
		],
	},
	$$timestamps: {
		entityType: EntityType.XrplAmm_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
			Source.Bithomp,
		],
	},
})({
	selectors: {
		NetworkAmmAccount: [
			'$network',
			'ammAccount',
		],
	},
})
