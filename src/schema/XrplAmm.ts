// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XrplAmmSelector {
	NetworkAmmAccount = 'NetworkAmmAccount',
}
export default {
	entityType: EntityType.XrplAmm,
	label: 'xrpl amm',
	labelPlural: 'xrpl amms',
	selectors: [
		{
			name: XrplAmmSelector.NetworkAmmAccount,
			fields: [
				'$network',
				'ammAccount',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XrplNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'ammAccount',
			label: 'amm account',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'assetCurrency',
			label: 'asset currency',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'assetIssuer',
			label: 'asset issuer',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'asset2Currency',
			label: 'asset2 currency',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'asset2Issuer',
			label: 'asset2 issuer',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lpTokenCurrency',
			label: 'lp token currency',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XrplAmm_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
