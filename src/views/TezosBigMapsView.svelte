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
	}: EntityListViewProps<EntityType.TezosBigMap> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBigMap}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBigMap })}
		<EntityView
			entityType={EntityType.TezosBigMap}
			entitySelector={tezosBigMap[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos big map
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
