<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.ZeroGDataBlob> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGDataBlob}
	bind:open
	resource={
		selection({
			...{
				fields: {
					dataRoot: true,
					$network: true,
					sizeBytes: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: zeroGDataBlob })}
		{@const zeroGDataBlobSelector = zeroGDataBlob[EntityMetaKey.Selector]}
		{@const network = zeroGDataBlobSelector.$network}
		<EntityView
			entityType={EntityType.ZeroGDataBlob}
			entitySelector={zeroGDataBlobSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/data-blob/[dataRoot=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						dataRoot: zeroGDataBlobSelector.dataRoot,
					}
				)
			}
		>
			{#snippet Title()}
				{zeroGDataBlobSelector.dataRoot || 'zero g data blob'}
			{/snippet}

			{#snippet Value()}
				{zeroGDataBlob.$network.name || `${zeroGDataBlob.$network.caip2.namespace}:${zeroGDataBlob.$network.caip2.reference}` || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGDataBlob.sizeBytes ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
