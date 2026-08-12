import { type } from 'arktype'


// Types
export const ociDigestWire = type('/^[a-z0-9][a-z0-9_+.-]*:[a-f0-9]{32,}$/')

export type OciDigest = typeof ociDigestWire.infer

export const ociDescriptorWire = type({
	mediaType: 'string > 0',
	digest: ociDigestWire,
	size: 'number.integer >= 0',
	'urls?': 'string[]',
	'artifactType?': 'string > 0',
	'annotations?': {
		'[string]': 'string',
	},
})

export type OciDescriptor = typeof ociDescriptorWire.infer

export const ociImageManifestWire = type({
	schemaVersion: '2',
	'mediaType?': 'string > 0',
	config: ociDescriptorWire,
	layers: ociDescriptorWire.array(),
	'subject?': ociDescriptorWire,
	'artifactType?': 'string > 0',
})

export type OciImageManifest = typeof ociImageManifestWire.infer

export const ociImageIndexWire = type({
	schemaVersion: '2',
	'mediaType?': 'string > 0',
	manifests: ociDescriptorWire.array(),
	'subject?': ociDescriptorWire,
	'artifactType?': 'string > 0',
})

export type OciImageIndex = typeof ociImageIndexWire.infer

export const ociManifestWire = ociImageManifestWire.or(ociImageIndexWire)

export type OciManifest = typeof ociManifestWire.infer

export const ociBearerTokenWire = type({
	'token?': 'string > 0',
	'access_token?': 'string > 0',
})
