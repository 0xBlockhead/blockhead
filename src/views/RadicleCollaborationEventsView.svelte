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
	}: EntityListViewProps<EntityType.RadicleCollaborationEvent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RadicleCollaborationEvent}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: radicleCollaborationEvent })}
		{@const radicleCollaborationEventSelector = radicleCollaborationEvent[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RadicleCollaborationEvent}
			entitySelector={radicleCollaborationEventSelector}
			href={
				resolve(
					'/radicle/repository/[rid=stringSegment]/(radicleRepository)/event/[eventId=stringSegment]',
					{
						rid: radicleCollaborationEventSelector.$repository.rid,
						eventId: radicleCollaborationEventSelector.eventId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
