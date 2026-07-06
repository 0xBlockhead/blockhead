// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum FilecoinDealSelector {
	NetworkDealId = 'NetworkDealId',
}
export default {
	entityType: EntityType.FilecoinDeal,
	label: 'filecoin deal',
	labelPlural: 'filecoin deals',
	selectors: [
		{
			name: FilecoinDealSelector.NetworkDealId,
			fields: [
				'$network',
				'dealId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'dealId',
			label: 'Deal ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$provider',
			label: 'Provider',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinMiner,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$client',
			label: 'Client',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'pieceCid',
			label: 'Piece CID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'pieceSizeBytes',
			label: 'Piece size bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verifiedDeal',
			label: 'Verified deal',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'label',
			label: 'Label',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'startEpoch',
			label: 'Start epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'endEpoch',
			label: 'End epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'storagePricePerEpochAttoFil',
			label: 'Storage price per epoch attoFIL',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'providerCollateralAttoFil',
			label: 'Provider collateral attoFIL',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'clientCollateralAttoFil',
			label: 'Client collateral attoFIL',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinDeal_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
