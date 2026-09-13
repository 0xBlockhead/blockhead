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
	}: EntityListViewProps<EntityType.ZeroGDataChunk> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGDataChunk}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: zeroGDataChunk })}
		{@const zeroGDataChunkSelector = zeroGDataChunk[EntityMetaKey.Selector]}
		{@const dataBlob = zeroGDataChunkSelector.$dataBlob}
		<EntityView
			entityType={EntityType.ZeroGDataChunk}
			entitySelector={zeroGDataChunkSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/data-blob/[dataRoot=stringSegment]/(zeroGDataBlob)/chunk/[chunkIndex=nonNegativeInteger]',
					{
						network: (
							dataBlob.$network.caip2 !== undefined ?
								caip2StringFromValue(dataBlob.$network.caip2)
							:
								dataBlob.$network.slug
						),
						dataRoot: dataBlob.dataRoot,
						chunkIndex: String(zeroGDataChunkSelector.chunkIndex),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
