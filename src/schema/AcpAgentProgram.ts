// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum AcpAgentProgramSelector {
	RegistryAgentId = 'RegistryAgentId',
	PackageName = 'PackageName',
	RepositoryUrl = 'RepositoryUrl',
}
export const AcpAgentProgram = entity({
	entityType: EntityType.AcpAgentProgram,
	label: 'ACP agent program',
	labelPlural: 'ACP agent programs',
})({
	registryAgentId: {
		label: 'registry agent ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	packageName: {
		label: 'package name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	repositoryUrl: {
		label: 'repository URL',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authors: {
		label: 'authors',
		type: EntityFieldType.Primitive,
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RegistryAgentId: [
			'registryAgentId',
		],
		PackageName: [
			'packageName',
		],
		RepositoryUrl: [
			'repositoryUrl',
		],
	},
})
