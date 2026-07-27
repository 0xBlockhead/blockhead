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
	}: EntityListViewProps<EntityType.TezosBigMapDiff> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBigMapDiff}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBigMapDiff })}
		<EntityView
			entityType={EntityType.TezosBigMapDiff}
			entitySelector={tezosBigMapDiff[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos big map diff
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
