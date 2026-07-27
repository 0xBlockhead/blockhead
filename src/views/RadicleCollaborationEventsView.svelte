<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		<EntityView
			entityType={EntityType.RadicleCollaborationEvent}
			entitySelector={radicleCollaborationEvent[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				radicle collaboration event
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
