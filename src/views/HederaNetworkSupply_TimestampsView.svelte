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
	}: EntityListViewProps<EntityType.HederaNetworkSupply_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaNetworkSupply_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaNetworkSupplyTimestamp })}
		<EntityView
			entityType={EntityType.HederaNetworkSupply_Timestamp}
			entitySelector={hederaNetworkSupplyTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hedera network supply timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
