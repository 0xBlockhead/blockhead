// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	$package: {
		label: 'package',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SuiPackage,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	packageId: {
		label: 'package ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	version: {
		label: 'version',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	digest: {
		label: 'digest',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	previousPackageId: {
		label: 'previous package ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	upgradePolicy: {
		label: 'upgrade policy',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$modules: {
		label: 'modules',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.MoveModule,
		cardinality: EntityFieldCardinality.Many,
	},
	$$moduleTimestamps: {
		label: 'module timestamps',
		type: EntityFieldType.EntitiesReference,
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
