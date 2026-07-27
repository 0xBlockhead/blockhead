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
	}: EntityListViewProps<EntityType.HederaTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaTransaction}
	bind:open
	resource={
		selection({
			fields: {
				transactionType: true,
				result: true,
				transactionId: true,
				consensusTimestamp: true,
			},
		})
	}
>
	{#snippet Item({ item: hederaTransaction })}
		{@const hederaTransactionSelector = hederaTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.HederaTransaction}
			entitySelector={hederaTransactionSelector}
		>
			{#snippet Title()}
				{hederaTransaction.transactionType || hederaTransactionSelector.transactionId || 'hedera transaction'}
			{/snippet}

			{#snippet Value()}
				{(hederaTransaction.result ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{hederaTransactionSelector.consensusTimestamp}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
