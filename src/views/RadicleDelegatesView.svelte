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
	}: EntityListViewProps<EntityType.RadicleDelegate> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RadicleDelegate}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: radicleDelegate })}
		{@const radicleDelegateSelector = radicleDelegate[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RadicleDelegate}
			entitySelector={radicleDelegateSelector}
			href={
				resolve(
					'/radicle/repository/[rid=stringSegment]/(radicleRepository)/delegate/[did=stringSegment]',
					{
						rid: radicleDelegateSelector.$repository.rid,
						did: radicleDelegateSelector.did,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
