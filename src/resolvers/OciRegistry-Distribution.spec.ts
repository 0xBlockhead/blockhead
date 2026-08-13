import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'


const {
	getManifest,
	getReferrers,
} = vi.hoisted(() => ({
	getManifest: vi.fn(),
	getReferrers: vi.fn(),
}))

vi.mock('$/sources/OciRegistry/Distribution/queries.ts', () => ({
	getManifest,
	getReferrers,
}))

const { default: ociRegistryDistribution } = await import('$/resolvers/OciRegistry-Distribution.ts')

expect(ociRegistryDistribution.source).toBe(Source.OciRegistry_Distribution)

const manifestResolver = ociRegistryDistribution.resolvers.find((resolver) => (
	resolver.entityType === EntityType.OciManifest
))
const descriptorResolver = ociRegistryDistribution.resolvers.find((resolver) => (
	resolver.entityType === EntityType.OciDescriptor
))
const referrersResolver = ociRegistryDistribution.resolvers.find((resolver) => (
	resolver.entityType === EntityType.OciManifest
	&& '$$referrers' in resolver.projections
))

if (manifestResolver == null || descriptorResolver == null || referrersResolver == null)
	throw new Error('OciRegistry-Distribution spec missing native resolvers')

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const digest = `sha256:${'a'.repeat(64)}`
const selector = {
	registry: 'registry.example',
	repository: 'team/image',
	reference: 'latest',
}

beforeEach(() => {
	getManifest.mockReset()
	getReferrers.mockReset()
})

it('projects image config, layers, and subject as native OCI descriptor references', async () => {
	getManifest.mockResolvedValueOnce({
		schemaVersion: 2,
		mediaType: 'application/vnd.oci.image.manifest.v1+json',
		contentDigest: digest,
		config: {
			mediaType: 'application/vnd.oci.image.config.v1+json',
			digest,
			size: 42,
		},
		layers: [{
			mediaType: 'application/vnd.oci.image.layer.v1.tar+gzip',
			digest,
			size: 84,
		}],
		subject: {
			mediaType: 'application/vnd.oci.image.manifest.v1+json',
			digest,
			size: 21,
		},
	})

	const manifest = await manifestResolver.resolve.RegistryRepositoryReference.resolve(selector, context)

	expect(getManifest).toHaveBeenCalledWith(selector)
	expect(manifest).toMatchObject({
		...selector,
		contentDigest: digest,
		$config: {
			[EntityMetaKey.Selector]: {
				$manifest: selector,
				descriptorKind: 'config',
				descriptorIndex: 0,
			},
		},
		$$layers: [{
			[EntityMetaKey.Selector]: {
				$manifest: selector,
				descriptorKind: 'layer',
				descriptorIndex: 0,
			},
		}],
		$subject: {
			[EntityMetaKey.Selector]: {
				$manifest: selector,
				descriptorKind: 'subject',
				descriptorIndex: 0,
			},
		},
	})
})

it('resolves an indexed child-manifest descriptor and rejects absent indices', async () => {
	getManifest.mockResolvedValue({
		schemaVersion: 2,
		manifests: [{
			mediaType: 'application/vnd.oci.image.manifest.v1+json',
			digest,
			size: 42,
			urls: ['https://registry.example/manifest'],
		}],
	})

	const descriptor = await descriptorResolver.resolve.ManifestKindIndex.resolve({
		$manifest: selector,
		descriptorKind: 'manifest',
		descriptorIndex: 0,
	}, context)

	expect(descriptor[EntityMetaKey.Selector]).toEqual({
		$manifest: selector,
		descriptorKind: 'manifest',
		descriptorIndex: 0,
	})
	expect(descriptorResolver.projections.digest(descriptor)).toBe(digest)
	expect(descriptorResolver.projections.sizeBytes(descriptor)).toBe(42)
	expect(descriptorResolver.projections.urls(descriptor)).toEqual(['https://registry.example/manifest'])

	await expect(descriptorResolver.resolve.ManifestKindIndex.resolve({
		$manifest: selector,
		descriptorKind: 'manifest',
		descriptorIndex: 1,
	}, context)).rejects.toThrow('descriptor not found')
})

it('withholds credentialed and signed descriptor URLs from the visible artifact view', async () => {
	getManifest.mockResolvedValue({
		schemaVersion: 2,
		manifests: [{
			mediaType: 'application/vnd.oci.image.manifest.v1+json',
			digest,
			size: 42,
			urls: [
				'https://registry.example/manifest',
				'https://reader:token@registry.example/manifest',
				'https://registry.example/manifest?signature=secret',
				'file:///private/manifest',
				'not-a-url',
			],
		}],
	})

	const descriptor = await descriptorResolver.resolve.ManifestKindIndex.resolve({
		$manifest: selector,
		descriptorKind: 'manifest',
		descriptorIndex: 0,
	}, context)

	expect(descriptorResolver.projections.urls(descriptor)).toEqual([
		'https://registry.example/manifest',
	])
})

it('discovers typed attestation and signature referrers and resolves their native descriptor route', async () => {
	const signatureDigest = `sha256:${'b'.repeat(64)}`
	const digestSelector = {
		...selector,
		reference: digest,
	}
	getReferrers.mockResolvedValue([{
		mediaType: 'application/vnd.oci.image.manifest.v1+json',
		digest: signatureDigest,
		size: 84,
		artifactType: 'application/vnd.example.signature.v1',
		annotations: {
			'org.example.signature.fingerprint': 'abcd',
		},
	}])

	const manifest = await referrersResolver.resolve.RegistryRepositoryReference.resolve(digestSelector, context)

	expect(getReferrers).toHaveBeenCalledWith({
		registry: 'registry.example',
		repository: 'team/image',
		digest,
		limit: 64,
	})
	expect(manifest.$$referrers).toEqual([{
		[EntityMetaKey.Selector]: {
			$manifest: digestSelector,
			descriptorKind: 'referrer',
			descriptorIndex: 0,
		},
		[EntityMetaKey.Fields]: expect.objectContaining({
			[entityFieldAddressKey(EntityType.OciDescriptor, [], 'artifactType')]: 'application/vnd.example.signature.v1',
			[entityFieldAddressKey(EntityType.OciDescriptor, [], 'annotations')]: {
				'org.example.signature.fingerprint': 'abcd',
			},
		}),
	}])

	getManifest.mockResolvedValueOnce({
		schemaVersion: 2,
		manifests: [],
		contentDigest: digest,
	})
	const descriptor = await descriptorResolver.resolve.ManifestKindIndex.resolve({
		$manifest: digestSelector,
		descriptorKind: 'referrer',
		descriptorIndex: 0,
	}, context)
	expect(descriptorResolver.projections.artifactType(descriptor)).toBe('application/vnd.example.signature.v1')
	expect(descriptorResolver.projections.annotations(descriptor)).toEqual({
		'org.example.signature.fingerprint': 'abcd',
	})
})
