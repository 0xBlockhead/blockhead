export const e2eOciManifestIdentity = {
	registry: 'quay.io',
	repository: 'prometheus/prometheus',
	reference: 'latest',
} as const

export const e2eOciManifest = {
	schemaVersion: 2,
	mediaType: 'application/vnd.oci.image.index.v1+json',
	contentDigest: `sha256:${'2'.repeat(64)}`,
	manifests: [{
		mediaType: 'application/vnd.oci.image.manifest.v1+json',
		digest: `sha256:${'1'.repeat(64)}`,
		size: 4242,
	}],
} as const
