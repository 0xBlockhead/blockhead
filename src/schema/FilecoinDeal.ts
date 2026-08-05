// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FilecoinDeal,
	labels: {
		singular: 'filecoin deal',
		plural: 'filecoin deals',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	dealId: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	$provider: {
		entityType: EntityType.FilecoinMiner,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	$client: {
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	pieceCid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	pieceSizeBytes: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	verifiedDeal: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startEpoch: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	endEpoch: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	storagePricePerEpochAttoFil: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	providerCollateralAttoFil: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	clientCollateralAttoFil: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	$$timestamps: {
		entityType: EntityType.FilecoinDeal_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkDealId: [
			'$network',
			'dealId',
		],
	},
})
