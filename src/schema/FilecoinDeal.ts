// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FilecoinDeal,
	labels: {
		singular: 'filecoin deal',
		plural: 'filecoin deals',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	dealId: {
		label: 'Deal ID',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	$provider: {
		label: 'Provider',
		entityType: EntityType.FilecoinMiner,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$client: {
		label: 'Client',
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pieceCid: {
		label: 'Piece CID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pieceSizeBytes: {
		label: 'Piece size bytes',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedDeal: {
		label: 'Verified deal',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	label: {
		label: 'Label',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startEpoch: {
		label: 'Start epoch',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endEpoch: {
		label: 'End epoch',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storagePricePerEpochAttoFil: {
		label: 'Storage price per epoch attoFIL',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerCollateralAttoFil: {
		label: 'Provider collateral attoFIL',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	clientCollateralAttoFil: {
		label: 'Client collateral attoFIL',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
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
