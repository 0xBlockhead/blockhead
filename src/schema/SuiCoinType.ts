// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiCoinTypeSelector {
	NetworkCoinType = 'NetworkCoinType',
}
export default {
	entityType: EntityType.SuiCoinType,
	label: 'sui coin type',
	labelPlural: 'sui coin types',
	selectors: [
		{
			name: SuiCoinTypeSelector.NetworkCoinType,
			fields: [
				'$network',
				'coinType',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SuiNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'coinType',
				label: 'coin type',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$definingStruct',
				label: 'defining struct',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.MoveStruct,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$treasuryCap',
				label: 'treasury cap',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SuiObject,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$assetInstance',
				label: 'asset instance',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AssetInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$balances',
				label: 'balances',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SuiCoinBalance_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$objects',
				label: 'objects',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SuiObject,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$regulatedStates',
				label: 'regulated states',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SuiRegulatedCoinState_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'decimals',
				label: 'Decimals',
				description: 'The number of decimal places used to display the amount.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'symbol',
				label: 'Symbol',
				description: 'The short ticker or symbol used for display.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'name',
				label: 'Name',
				description: 'The human-readable name of the subject.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'description',
				label: 'Description',
				description: 'A human-readable description from the source domain.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'iconUrl',
				label: 'icon URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
