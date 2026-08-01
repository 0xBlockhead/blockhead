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
		label: 'package',
		entityType: EntityType.SuiPackage,
		cardinality: EntityFieldCardinality.One,
	},
	upgradedPackageId: {
		label: 'upgraded package ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	upgradedVersion: {
		label: 'upgraded version',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousPackageId: {
		label: 'previous package ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	upgradeCapSelector: {
		label: 'upgrade cap selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	policy: {
		label: 'policy',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	digest: {
		label: 'digest',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$transaction: {
		label: 'transaction',
		entityType: EntityType.SuiTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$packageVersion: {
		label: 'package version',
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
