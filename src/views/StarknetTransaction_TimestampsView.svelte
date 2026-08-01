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
	}: EntityListViewProps<EntityType.StarknetTransaction_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetTransaction_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$transaction: true,
				timestampMs: true,
				executionStatus: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetTransactionTimestamp })}
		{@const starknetTransactionTimestampSelector = starknetTransactionTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StarknetTransaction_Timestamp}
			entitySelector={starknetTransactionTimestampSelector}
		>
			{#snippet Title()}
				{starknetTransactionTimestampSelector.$transaction.transactionHash || 'starknet transaction'}
			{/snippet}

			{#snippet Value()}
				{starknetTransactionTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{starknetTransactionTimestamp.executionStatus ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
