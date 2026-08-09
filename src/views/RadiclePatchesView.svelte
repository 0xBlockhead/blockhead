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
		id = 'RadiclePatches-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.RadiclePatch> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RadiclePatch}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: radiclePatch })}
		{@const radiclePatchSelector = radiclePatch[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RadiclePatch}
			entitySelector={radiclePatchSelector}
			href={
				resolve(
					'/radicle/repository/[rid=stringSegment]/(radicleRepository)/patch/[patchId=stringSegment]',
					{
						rid: radiclePatchSelector.$repository.rid,
						patchId: radiclePatchSelector.patchId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
