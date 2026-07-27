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
		<EntityView
			entityType={EntityType.RadicleDelegate}
			entitySelector={radicleDelegate[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				radicle delegate
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
