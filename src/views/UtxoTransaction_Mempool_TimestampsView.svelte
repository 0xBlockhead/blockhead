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
	}: EntityListViewProps<EntityType.UtxoTransaction_Mempool_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UtxoTransaction_Mempool_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				bip125Replaceable: true,
				timestampMs: true,
				$transaction: {
					fields: {
						feeSats: true,
						isCoinbase: true,
					},
				},
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: utxoTransactionMempoolTimestamp })}
		{@const utxoTransactionMempoolTimestampSelector = utxoTransactionMempoolTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.UtxoTransaction_Mempool_Timestamp}
			entitySelector={utxoTransactionMempoolTimestampSelector}
		>
			{#snippet Title()}
				{utxoTransactionMempoolTimestamp.bip125Replaceable}
			{/snippet}

			{#snippet Value()}
				{utxoTransactionMempoolTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[utxoTransactionMempoolTimestampSelector.$transaction.txId || 'UTXO transaction', utxoTransactionMempoolTimestampSelector.source].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
