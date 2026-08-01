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
	}: EntityListViewProps<EntityType.ArweaveTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ArweaveTransaction}
	bind:open
	resource={
		selection({
			fields: {
				transactionId: true,
				quantityWinston: true,
				$block: true,
				$resource: true,
			},
		})
	}
>
	{#snippet Item({ item: arweaveTransaction })}
		{@const arweaveTransactionSelector = arweaveTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ArweaveTransaction}
			entitySelector={arweaveTransactionSelector}
		>
			{#snippet Title()}
				{arweaveTransactionSelector.transactionId || 'arweave transaction'}
			{/snippet}

			{#snippet Value()}
				{arweaveTransaction.quantityWinston ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[arweaveTransaction.$block == null ? '' : String(arweaveTransaction.$block.height) || arweaveTransaction.$block.indepHash || 'arweave block', arweaveTransaction.$resource == null ? '' : arweaveTransaction.$resource.canonicalUri || arweaveTransaction.$resource.transactionId || 'arweave resource'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
