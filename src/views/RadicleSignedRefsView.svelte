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
	}: EntityListViewProps<EntityType.RadicleSignedRef> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RadicleSignedRef}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: radicleSignedRef })}
		{@const radicleSignedRefSelector = radicleSignedRef[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RadicleSignedRef}
			entitySelector={radicleSignedRefSelector}
			href={
				resolve(
					'/radicle/repository/[rid=stringSegment]/(radicleRepository)/signed-ref/[nodeId=stringSegment]/[refName=stringSegment]',
					{
						rid: radicleSignedRefSelector.$repository.rid,
						nodeId: radicleSignedRefSelector.nodeId,
						refName: radicleSignedRefSelector.refName,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
