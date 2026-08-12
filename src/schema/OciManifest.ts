// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.OciManifest,
	labels: {
		singular: 'OCI manifest',
		plural: 'OCI manifests',
	},
	description: 'An OCI image manifest or image index addressed by registry, repository, and tag or digest.',
})({
	registry: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	repository: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	reference: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	contentDigest: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.OciRegistry_Distribution,
		],
	},
	mediaType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.OciRegistry_Distribution,
		],
	},
	artifactType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.OciRegistry_Distribution,
		],
	},
	$config: {
		entityType: EntityType.OciDescriptor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.OciRegistry_Distribution,
		],
	},
	$subject: {
		entityType: EntityType.OciDescriptor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.OciRegistry_Distribution,
		],
	},
	$$layers: {
		entityType: EntityType.OciDescriptor,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.OciRegistry_Distribution,
		],
	},
	$$manifests: {
		entityType: EntityType.OciDescriptor,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.OciRegistry_Distribution,
		],
	},
	$$referrers: {
		entityType: EntityType.OciDescriptor,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.OciRegistry_Distribution,
		],
	},
})({
	selectors: {
		RegistryRepositoryReference: [
			'registry',
			'repository',
			'reference',
		],
	},
})
