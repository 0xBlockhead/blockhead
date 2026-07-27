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
	}: EntityListViewProps<EntityType.TezosCycle> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosCycle}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosCycle })}
		<EntityView
			entityType={EntityType.TezosCycle}
			entitySelector={tezosCycle[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos cycle
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
