// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum BitcoinCashBcmrMetadataSelector {
	NetworkCategoryIdRegistryUrl = 'NetworkCategoryIdRegistryUrl',
}
export default {
	entityType: EntityType.BitcoinCashBcmrMetadata,
	label: 'Bitcoin cash bcmr metadata',
	labelPlural: 'Bitcoin Cash BCMR metadata entries',
	selectors: [
		{
			name: BitcoinCashBcmrMetadataSelector.NetworkCategoryIdRegistryUrl,
			fields: [
				'$network',
				'categoryId',
				'registryUrl',
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
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'registryUrl',
				label: 'registry URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'name',
				label: 'Name',
				description: 'The human-readable name of the subject.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCashBcmr_Github,
				],
		},
		{
				name: 'description',
				label: 'Description',
				description: 'A human-readable description from the source domain.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCashBcmr_Github,
				],
		},
		{
				name: 'symbol',
				label: 'Symbol',
				description: 'The short ticker or symbol used for display.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCashBcmr_Github,
				],
		},
		{
				name: 'decimals',
				label: 'Decimals',
				description: 'The number of decimal places used to display the amount.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.BitcoinCashBcmr_Github,
				],
		},
	],
} as const satisfies EntityDefinition
