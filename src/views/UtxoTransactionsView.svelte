<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.UtxoTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UtxoTransaction}
	bind:open
	resource={
		selection({
			fields: {
				txId: true,
				feeSats: true,
				isCoinbase: true,
			},
		})
	}
>
	{#snippet Item({ item: utxoTransaction })}
		{@const utxoTransactionSelector = utxoTransaction[EntityMetaKey.Selector]}
		{@const network = utxoTransactionSelector.$network}
		<EntityView
			entityType={EntityType.UtxoTransaction}
			entitySelector={utxoTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						transactionId: utxoTransactionSelector.txId,
					}
				)
			}
		>
			{#snippet Title()}
				{utxoTransactionSelector.txId || 'UTXO transaction'}
			{/snippet}

			{#snippet Value()}
				{utxoTransactionSelector.txId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String(utxoTransaction.feeSats ?? ''), String(utxoTransaction.isCoinbase ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
