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
	}: EntityListViewProps<EntityType.AlgorandAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandAccount_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandAccountTimestamp })}
		<EntityView
			entityType={EntityType.AlgorandAccount_Timestamp}
			entitySelector={algorandAccountTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				algorand account timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
