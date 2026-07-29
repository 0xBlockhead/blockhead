// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SuiPackageUpgrade,
	labels: {
		singular: 'sui package upgrade',
		plural: 'sui package upgrades',
	},
})({
	$package: {
		label: 'package',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SuiPackage,
		cardinality: EntityFieldCardinality.One,
	},
	upgradedPackageId: {
		label: 'upgraded package ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	upgradedVersion: {
		label: 'upgraded version',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousPackageId: {
		label: 'previous package ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	upgradeCapSelector: {
		label: 'upgrade cap selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	policy: {
		label: 'policy',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	digest: {
		label: 'digest',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SuiTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$packageVersion: {
		label: 'package version',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SuiPackageVersion,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		PackageUpgradedPackageId: [
			'$package',
			'upgradedPackageId',
		],
	},
})
