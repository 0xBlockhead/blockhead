import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BitcoinCashCashTokenCategorySelector {
	NetworkCategoryId = 'networkCategoryId',
}
export default {
	entityType: EntityType.BitcoinCashCashTokenCategory,
	label: 'Bitcoin cash cash token category',
	labelPlural: 'Bitcoin cash cash token categories',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'categoryId',
			label: 'category ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$metadata',
			label: 'metadata',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitcoinCashBcmrMetadata,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
