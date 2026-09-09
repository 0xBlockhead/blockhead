<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.OciManifest> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.OciManifest}
	bind:open
	resource={
		selection({
			fields: {
				repository: true,
				reference: true,
				artifactType: true,
				mediaType: true,
			},
		})
	}
>
	{#snippet Item({ item: ociManifest })}
		{@const ociManifestSelector = ociManifest[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.OciManifest}
			entitySelector={ociManifestSelector}
			href={
				resolve(
					'/(social)/(oci)/oci/registry/[registry=stringSegment]/repository/[repository=stringSegment]/manifest/[reference=stringSegment]',
					{
						registry: ociManifestSelector.registry,
						repository: encodeURIComponent(ociManifestSelector.repository),
						reference: encodeURIComponent(ociManifestSelector.reference),
					}
				)
			}
		>
			{#snippet Title()}
				{ociManifestSelector.repository || 'OCI manifest'}
			{/snippet}

			{#snippet Value()}
				{ociManifestSelector.reference}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(ociManifest.artifactType ?? ''), (ociManifest.mediaType ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
