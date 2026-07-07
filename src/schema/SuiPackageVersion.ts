// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiPackageVersionSelector {
	NetworkPackageIdVersionDigest = 'NetworkPackageIdVersionDigest',
}
export default {
	entityType: EntityType.SuiPackageVersion,
	label: 'sui package version',
	labelPlural: 'sui package versions',
	selectors: [
		{
			name: SuiPackageVersionSelector.NetworkPackageIdVersionDigest,
			fields: [
				'$network',
				'packageId',
				'version',
				'digest',
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
			name: '$package',
			label: 'package',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SuiPackage,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'packageId',
			label: 'package ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'version',
			label: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'digest',
			label: 'digest',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'previousPackageId',
			label: 'previous package ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'upgradePolicy',
			label: 'upgrade policy',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$modules',
			label: 'modules',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoveModule,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$moduleTimestamps',
			label: 'module timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoveModule_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
