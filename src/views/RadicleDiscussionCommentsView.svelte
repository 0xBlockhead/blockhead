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
	}: EntityListViewProps<EntityType.RadicleDiscussionComment> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RadicleDiscussionComment}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: radicleDiscussionComment })}
		<EntityView
			entityType={EntityType.RadicleDiscussionComment}
			entitySelector={radicleDiscussionComment[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				radicle discussion comment
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
