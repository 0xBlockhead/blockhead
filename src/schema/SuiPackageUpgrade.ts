import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum SuiPackageUpgradeSelector {
	PackageUpgradedPackageId = '$package+upgradedPackageId',
}
export default {
	entityType: EntityType.SuiPackageUpgrade,
	label: 'sui package upgrade',
	labelPlural: 'sui package upgrades',
	selectors: [
		{
			name: SuiPackageUpgradeSelector.PackageUpgradedPackageId,
			fields: [
				'$package',
				'upgradedPackageId',
			],
		},
	],
	fields: [
		{
			name: '$package',
			label: 'package',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SuiPackage,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'upgradedPackageId',
			label: 'upgraded package ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'upgradedVersion',
			label: 'upgraded version',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'previousPackageId',
			label: 'previous package ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'upgradeCapSelector',
			label: 'upgrade cap selector',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'policy',
			label: 'policy',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'digest',
			label: 'digest',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SuiTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$packageVersion',
			label: 'package version',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SuiPackageVersion,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
