// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum FilecoinDealSelector {
	NetworkDealId = 'NetworkDealId',
}
export const FilecoinDeal = entity({
	entityType: EntityType.FilecoinDeal,
	labels: {
		singular: 'filecoin deal',
		plural: 'filecoin deals',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	dealId: {
		label: 'Deal ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	$provider: {
		label: 'Provider',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FilecoinMiner,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$client: {
		label: 'Client',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pieceCid: {
		label: 'Piece CID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pieceSizeBytes: {
		label: 'Piece size bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedDeal: {
		label: 'Verified deal',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	label: {
		label: 'Label',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startEpoch: {
		label: 'Start epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endEpoch: {
		label: 'End epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storagePricePerEpochAttoFil: {
		label: 'Storage price per epoch attoFIL',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerCollateralAttoFil: {
		label: 'Provider collateral attoFIL',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	clientCollateralAttoFil: {
		label: 'Client collateral attoFIL',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
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
