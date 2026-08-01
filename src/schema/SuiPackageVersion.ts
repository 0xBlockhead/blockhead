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
		label: 'network',
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	$package: {
		label: 'package',
		entityType: EntityType.SuiPackage,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	packageId: {
		label: 'package ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	version: {
		label: 'version',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	digest: {
		label: 'digest',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	previousPackageId: {
		label: 'previous package ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	upgradePolicy: {
		label: 'upgrade policy',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$modules: {
		label: 'modules',
		entityType: EntityType.MoveModule,
		cardinality: EntityFieldCardinality.Many,
	},
	$$moduleTimestamps: {
		label: 'module timestamps',
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
