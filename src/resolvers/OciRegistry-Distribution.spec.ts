import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'


const getManifest = vi.hoisted(() => vi.fn())

vi.mock('$/sources/OciRegistry/Distribution/queries.ts', () => ({
	getManifest,
}))

const { default: ociRegistryDistribution } = await import('$/resolvers/OciRegistry-Distribution.ts')

const manifestResolver = ociRegistryDistribution.resolvers.find((resolver) => (
	resolver.entityType === EntityType.OciManifest
))
const descriptorResolver = ociRegistryDistribution.resolvers.find((resolver) => (
	resolver.entityType === EntityType.OciDescriptor
))

if (manifestResolver == null || descriptorResolver == null)
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
