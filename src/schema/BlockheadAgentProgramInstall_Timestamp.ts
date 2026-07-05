// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadAgentProgramInstall_TimestampSelector {
	InstallTimestampMsSource = 'InstallTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadAgentProgramInstall_Timestamp,
	label: 'blockhead agent program install timestamp',
	labelPlural: 'blockhead agent program install observations',
	selectors: [
		{
			name: BlockheadAgentProgramInstall_TimestampSelector.InstallTimestampMsSource,
			fields: [
				'$install',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$install',
				label: 'install',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadAgentProgramInstall,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'status',
				label: 'status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'versionProbe',
				label: 'version probe',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'executableHashAlgorithm',
				label: 'executable hash algorithm',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'executableHash',
				label: 'executable hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'error',
				label: 'error',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
