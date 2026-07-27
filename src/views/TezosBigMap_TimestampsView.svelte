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
	}: EntityListViewProps<EntityType.TezosBigMap_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBigMap_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBigMapTimestamp })}
		<EntityView
			entityType={EntityType.TezosBigMap_Timestamp}
			entitySelector={tezosBigMapTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos big map timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
