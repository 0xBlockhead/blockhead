// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XrplAmm_TimestampSelector {
	AmmLedgerIndexSource = 'AmmLedgerIndexSource',
}
export default {
	entityType: EntityType.XrplAmm_Timestamp,
	label: 'xrpl amm timestamp',
	labelPlural: 'xrpl amm observations',
	selectors: [
		{
			name: XrplAmm_TimestampSelector.AmmLedgerIndexSource,
			fields: [
				'$amm',
				'ledgerIndex',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$amm',
			label: 'amm',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XrplAmm,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'ledgerIndex',
			label: 'ledger index',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'assetAmount',
			label: 'asset amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'asset2Amount',
			label: 'asset2 amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lpTokenBalance',
			label: 'lp token balance',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tradingFee',
			label: 'trading fee',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'auctionSlot',
			label: 'auction slot',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'voteSlots',
			label: 'vote slots',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$ledgerEntry',
			label: 'ledger entry',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XrplLedgerEntry,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
