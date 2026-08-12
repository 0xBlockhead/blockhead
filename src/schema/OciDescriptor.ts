// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.OciDescriptor,
	labels: {
		singular: 'OCI descriptor',
		plural: 'OCI descriptors',
	},
	description: 'A config, layer, child-manifest, or subject descriptor declared by one OCI manifest.',
})({
	$manifest: {
		entityType: EntityType.OciManifest,
		cardinality: EntityFieldCardinality.One,
	},
	descriptorKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	descriptorIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	mediaType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.OciRegistry_Distribution,
		],
	},
	digest: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.OciRegistry_Distribution,
		],
	},
	sizeBytes: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.OciRegistry_Distribution,
		],
	},
	urls: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.OciRegistry_Distribution,
		],
	},
})({
	selectors: {
		ManifestKindIndex: [
			'$manifest',
			'descriptorKind',
			'descriptorIndex',
		],
	},
})
