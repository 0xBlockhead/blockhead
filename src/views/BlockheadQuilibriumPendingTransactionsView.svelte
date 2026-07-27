<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Quilibrium pending transactions',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadQuilibriumPendingTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadQuilibriumPendingTransaction}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				transactionAddress: true,
				amount: true,
				deliveryType: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadQuilibriumPendingTransaction })}
		{@const blockheadQuilibriumPendingTransactionSelector = blockheadQuilibriumPendingTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadQuilibriumPendingTransaction}
			entitySelector={blockheadQuilibriumPendingTransactionSelector}
		>
			{#snippet Title()}
				{blockheadQuilibriumPendingTransactionSelector.transactionAddress || 'blockhead quilibrium pending transaction'}
			{/snippet}

			{#snippet Value()}
				{String(blockheadQuilibriumPendingTransaction.amount ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(blockheadQuilibriumPendingTransaction.deliveryType ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
