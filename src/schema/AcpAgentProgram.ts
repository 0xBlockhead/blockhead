// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AcpAgentProgram,
	labels: {
		singular: 'ACP agent program',
		plural: 'ACP agent programs',
	},
})({
	registryAgentId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AcpRegistry_Rest,
		],
	},
	packageName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AcpRegistry_Rest,
		],
	},
	repositoryUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AcpRegistry_Rest,
		],
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AcpRegistry_Rest,
		],
	},
	authors: {
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AcpRegistry_Rest,
		],
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
