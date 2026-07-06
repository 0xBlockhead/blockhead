// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum AcpAgentProgramSelector {
	RegistryAgentId = 'RegistryAgentId',
	PackageName = 'PackageName',
	RepositoryUrl = 'RepositoryUrl',
}
export default {
	entityType: EntityType.AcpAgentProgram,
	label: 'ACP agent program',
	labelPlural: 'ACP agent programs',
	selectors: [
		{
			name: AcpAgentProgramSelector.RegistryAgentId,
			fields: [
				'registryAgentId',
			],
		},
		{
			name: AcpAgentProgramSelector.PackageName,
			fields: [
				'packageName',
			],
		},
		{
			name: AcpAgentProgramSelector.RepositoryUrl,
			fields: [
				'repositoryUrl',
			],
		},
	],
	fields: [
		{
			name: 'registryAgentId',
			label: 'registry agent ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'packageName',
			label: 'package name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'repositoryUrl',
			label: 'repository URL',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'authors',
			label: 'authors',
			type: EntityFieldType.Primitive,
			primitiveType: type('string').array(),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
