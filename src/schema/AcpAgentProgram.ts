// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AcpAgentProgram,
	labels: {
		singular: 'ACP agent program',
		plural: 'ACP agent programs',
	},
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
		primitiveType: UrlString,
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
