import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum BitcoinCashCashTokenCategorySelector {
	NetworkCategoryId = 'networkCategoryId',
}

export default {
	entityType: EntityType.BitcoinCashCashTokenCategory,

	label: 'Bitcoin Cash CashToken Category',
	labelPlural: 'Bitcoin Cash CashToken Categories',

	selectors: [
		{
			name: BitcoinCashCashTokenCategorySelector.NetworkCategoryId,
			fields: [
				'$network',
				'categoryId',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'categoryId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$metadata',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitcoinCashBcmrMetadata,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
