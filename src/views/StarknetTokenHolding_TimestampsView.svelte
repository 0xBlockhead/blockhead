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
	}: EntityListViewProps<EntityType.StarknetTokenHolding_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetTokenHolding_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$holding: true,
					indexedBalanceRaw: true,
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: starknetTokenHoldingTimestamp })}
		{@const starknetTokenHoldingTimestampSelector = starknetTokenHoldingTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StarknetTokenHolding_Timestamp}
			entitySelector={starknetTokenHoldingTimestampSelector}
		>
			{#snippet Title()}
				{starknetTokenHoldingTimestampSelector.$holding.$tokenContract.address || 'starknet contract'}
			{/snippet}

			{#snippet Value()}
				{starknetTokenHoldingTimestamp.indexedBalanceRaw}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{starknetTokenHoldingTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
