// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SuiPackageVersion,
	labels: {
		singular: 'sui package version',
		plural: 'sui package versions',
	},
})({
	$network: {
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	$package: {
		entityType: EntityType.SuiPackage,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	packageId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	version: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	digest: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	previousPackageId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	upgradePolicy: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$modules: {
		entityType: EntityType.MoveModule,
		cardinality: EntityFieldCardinality.Many,
	},
	$$moduleTimestamps: {
		entityType: EntityType.MoveModule_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkPackageIdVersionDigest: [
			'$network',
			'packageId',
			'version',
			'digest',
		],
	},
})
