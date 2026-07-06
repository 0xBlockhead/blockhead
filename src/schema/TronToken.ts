// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum TronTokenSelector {
	NetworkTokenId = 'NetworkTokenId',
}
export default {
	entityType: EntityType.TronToken,
	label: 'tron token',
	labelPlural: 'tron tokens',
	selectors: [
		{
			name: TronTokenSelector.NetworkTokenId,
			fields: [
				'$network',
				'tokenId',
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
			name: 'tokenId',
			label: 'Token ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'standard',
			label: 'Standard',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: '$owner',
			label: 'Owner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: '$contract',
			label: 'Contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: 'createdTimestampMs',
			label: 'Created',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: '$$accountBalanceTimestamps',
			label: 'Account balance observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronAccountTokenBalance_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronToken_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
