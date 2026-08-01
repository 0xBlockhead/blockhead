<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Algorand pending transactions',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadAlgorandPendingTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAlgorandPendingTransaction}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				txId: true,
				transactionType: true,
				observedAtMs: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadAlgorandPendingTransaction })}
		{@const blockheadAlgorandPendingTransactionSelector = blockheadAlgorandPendingTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAlgorandPendingTransaction}
			entitySelector={blockheadAlgorandPendingTransactionSelector}
		>
			{#snippet Title()}
				{blockheadAlgorandPendingTransactionSelector.txId || 'blockhead algorand pending transaction'}
			{/snippet}

			{#snippet Value()}
				{blockheadAlgorandPendingTransaction.transactionType ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadAlgorandPendingTransactionSelector.observedAtMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
