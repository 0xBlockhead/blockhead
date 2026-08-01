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
	}: EntityListViewProps<EntityType.StarknetEvent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetEvent}
	bind:open
	resource={
		selection({
			fields: {
				eventIndex: true,
				$transaction: true,
				$fromContract: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetEvent })}
		{@const starknetEventSelector = starknetEvent[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StarknetEvent}
			entitySelector={starknetEventSelector}
		>
			{#snippet Title()}
				{starknetEventSelector.eventIndex}
			{/snippet}

			{#snippet Value()}
				{starknetEventSelector.$transaction.transactionHash || 'starknet transaction'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{starknetEvent.$fromContract == null ? '' : starknetEvent.$fromContract.address || 'starknet contract'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
