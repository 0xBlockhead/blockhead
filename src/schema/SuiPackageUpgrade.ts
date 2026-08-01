// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.SuiPackage,
		cardinality: EntityFieldCardinality.One,
	},
	upgradedPackageId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	upgradedVersion: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousPackageId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	upgradeCapSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	policy: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	digest: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$transaction: {
		entityType: EntityType.SuiTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$packageVersion: {
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
