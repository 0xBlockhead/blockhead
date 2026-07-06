// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AlgorandAssetHolding_RoundSelector {
	AccountAssetRoundSource = 'AccountAssetRoundSource',
}
export default {
	entityType: EntityType.AlgorandAssetHolding_Round,
	label: 'algorand asset holding round',
	labelPlural: 'algorand asset holding rounds',
	selectors: [
		{
			name: AlgorandAssetHolding_RoundSelector.AccountAssetRoundSource,
			fields: [
				'$account',
				'$asset',
				'round',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AlgorandAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$asset',
			label: 'asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AlgorandAsset,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'round',
			label: 'round',
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
			name: 'amount',
			label: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'frozen',
			label: 'frozen',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'optedInAtRound',
			label: 'opted in AT round',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'deleted',
			label: 'deleted',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
