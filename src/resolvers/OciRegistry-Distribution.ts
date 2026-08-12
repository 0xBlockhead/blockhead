import { EntityType } from '$/schema/EntityType.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import type { OciDescriptor, OciManifest as OciManifestWire } from '$/sources/OciRegistry/Distribution/types.ts'
import { Source } from '$/sources/Source.ts'


const descriptorReference = (
	$manifest: {
		registry: string
		repository: string
		reference: string
	},
	descriptorKind: string,
	descriptorIndex: number,
	descriptor: OciDescriptor
) => ({
	[EntityMetaKey.Selector]: {
		$manifest,
		descriptorKind,
		descriptorIndex,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.OciDescriptor, [], 'mediaType')]: descriptor.mediaType,
		[entityFieldAddressKey(EntityType.OciDescriptor, [], 'digest')]: descriptor.digest,
		[entityFieldAddressKey(EntityType.OciDescriptor, [], 'sizeBytes')]: descriptor.size,
		[entityFieldAddressKey(EntityType.OciDescriptor, [], 'urls')]: descriptor.urls ?? [],
	},
})

const manifestFields = (
	registry: string,
	repository: string,
	reference: string,
	manifest: OciManifestWire & { contentDigest?: string }
) => {
	const $manifest = { registry, repository, reference }
	return {
		registry,
		repository,
		reference,
		contentDigest: manifest.contentDigest,
		mediaType: manifest.mediaType,
		artifactType: manifest.artifactType,
		...('config' in manifest && {
			$config: descriptorReference($manifest, 'config', 0, manifest.config),
			$$layers: manifest.layers.map((descriptor, descriptorIndex) => (
				descriptorReference($manifest, 'layer', descriptorIndex, descriptor)
			)),
		}),
		...('manifests' in manifest && {
			$$manifests: manifest.manifests.map((descriptor, descriptorIndex) => (
				descriptorReference($manifest, 'manifest', descriptorIndex, descriptor)
			)),
		}),
		...(manifest.subject != null && {
			$subject: descriptorReference($manifest, 'subject', 0, manifest.subject),
		}),
	}
}

const readManifest = async (registry: string, repository: string, reference: string) => (
	manifestFields(
		registry,
		repository,
		reference,
		await (
			typeof window === 'undefined' ?
				(await import('$/sources/OciRegistry/Distribution/queries.ts')).getManifest({ registry, repository, reference })
			:
				(await import('$/sources/OciRegistry/Distribution/queries.remote.ts')).getManifestRemote({ registry, repository, reference })
		)
	)
)

export default {
	meta: {
		source: Source.OciRegistry_Distribution,
		resolversCount: 2,
	},
	resolvers: [
		defineResolver({
			entityType: EntityType.OciManifest,
			resolve: {
				RegistryRepositoryReference: {
					resolve: ({ registry, repository, reference }) => readManifest(registry, repository, reference),
				},
			},
		})({
			registry: (manifest) => manifest.registry,
			repository: (manifest) => manifest.repository,
			reference: (manifest) => manifest.reference,
			contentDigest: (manifest) => manifest.contentDigest,
			mediaType: (manifest) => manifest.mediaType,
			artifactType: (manifest) => manifest.artifactType,
			$config: (manifest) => manifest.$config,
			$subject: (manifest) => manifest.$subject,
			$$layers: (manifest) => manifest.$$layers ?? [],
			$$manifests: (manifest) => manifest.$$manifests ?? [],
		}),

		defineResolver({
			entityType: EntityType.OciDescriptor,
			resolve: {
				ManifestKindIndex: {
					resolve: async ({ $manifest, descriptorKind, descriptorIndex }) => {
						const manifest = await readManifest($manifest.registry, $manifest.repository, $manifest.reference)
						const descriptor = (
							descriptorKind === 'config' ? manifest.$config
							: descriptorKind === 'subject' ? manifest.$subject
							: descriptorKind === 'layer' ? manifest.$$layers?.[descriptorIndex]
							: descriptorKind === 'manifest' ? manifest.$$manifests?.[descriptorIndex]
							: undefined
						)
						if (descriptor == null)
							throw new Error('OciRegistry_Distribution: descriptor not found')

						return descriptor
					},
				},
			},
		})({
			$manifest: (descriptor) => descriptor[EntityMetaKey.Selector].$manifest,
			descriptorKind: (descriptor) => descriptor[EntityMetaKey.Selector].descriptorKind,
			descriptorIndex: (descriptor) => descriptor[EntityMetaKey.Selector].descriptorIndex,
			mediaType: (descriptor) => descriptor[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.OciDescriptor, [], 'mediaType')],
			digest: (descriptor) => descriptor[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.OciDescriptor, [], 'digest')],
			sizeBytes: (descriptor) => descriptor[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.OciDescriptor, [], 'sizeBytes')],
			urls: (descriptor) => descriptor[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.OciDescriptor, [], 'urls')],
		}),
	],
} satisfies RegisteredSourceResolverModule
