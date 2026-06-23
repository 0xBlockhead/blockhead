import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum SuiPackageSelector {
	NetworkOriginalPackageId = '$network+originalPackageId',
}
export default {
	entityType: EntityType.SuiPackage,
	label: 'sui package',
	labelPlural: 'sui packages',
	selectors: [
		{
			name: SuiPackageSelector.NetworkOriginalPackageId,
			fields: [
				'$network',
				'originalPackageId',
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
			name: 'originalPackageId',
			label: 'original package ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$versions',
			label: 'versions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SuiPackageVersion,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$upgrades',
			label: 'upgrades',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SuiPackageUpgrade,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
