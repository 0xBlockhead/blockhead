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
	}: EntityListViewProps<EntityType.OciDescriptor> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.OciDescriptor}
	bind:open
	resource={
		selection({
			...{
				fields: {
					descriptorKind: true,
					digest: true,
					sizeBytes: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: ociDescriptor })}
		{@const ociDescriptorSelector = ociDescriptor[EntityMetaKey.Selector]}
		{@const manifest = ociDescriptorSelector.$manifest}
		<EntityView
			entityType={EntityType.OciDescriptor}
			entitySelector={ociDescriptorSelector}
			href={
				resolve(
					'/(social)/(oci)/oci/registry/[registry=stringSegment]/repository/[repository=stringSegment]/manifest/[reference=stringSegment]/(ociManifest)/descriptor/[descriptorKind=stringSegment]/[descriptorIndex=nonNegativeInteger]',
					{
						registry: manifest.registry,
						repository: encodeURIComponent(manifest.repository),
						reference: encodeURIComponent(manifest.reference),
						descriptorKind: ociDescriptorSelector.descriptorKind,
						descriptorIndex: String(ociDescriptorSelector.descriptorIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{ociDescriptorSelector.descriptorKind || 'OCI descriptor'}
			{/snippet}

			{#snippet Value()}
				{ociDescriptor.digest}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{ociDescriptor.sizeBytes}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
