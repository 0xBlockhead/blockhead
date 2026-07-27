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
	}: EntityListViewProps<EntityType.HederaNetworkFee_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaNetworkFee_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaNetworkFeeTimestamp })}
		<EntityView
			entityType={EntityType.HederaNetworkFee_Timestamp}
			entitySelector={hederaNetworkFeeTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hedera network fee timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
