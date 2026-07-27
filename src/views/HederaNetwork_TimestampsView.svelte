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
	}: EntityListViewProps<EntityType.HederaNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaNetworkTimestamp })}
		<EntityView
			entityType={EntityType.HederaNetwork_Timestamp}
			entitySelector={hederaNetworkTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hedera network timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
