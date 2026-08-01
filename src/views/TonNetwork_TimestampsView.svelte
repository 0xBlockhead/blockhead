<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.TonNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonNetworkTimestamp })}
		<EntityView
			entityType={EntityType.TonNetwork_Timestamp}
			entitySelector={tonNetworkTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON network timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
