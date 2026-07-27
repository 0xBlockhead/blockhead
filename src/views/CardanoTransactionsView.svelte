<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.CardanoTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoTransaction}
	bind:open
	resource={
		selection({
			fields: {
				hash: true,
				blockSlot: true,
				fee: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoTransaction })}
		{@const cardanoTransactionSelector = cardanoTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CardanoTransaction}
			entitySelector={cardanoTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]',
					{
						network: (
							'caip2' in cardanoTransactionSelector.$network ?
								String(caip2StringFromValue(cardanoTransactionSelector.$network.caip2))
							:
								String(cardanoTransactionSelector.$network.slug)
						),
						transactionId: String(cardanoTransactionSelector.hash),
					}
				)
			}
		>
			{#snippet Title()}
				{cardanoTransactionSelector.hash || 'Cardano transaction'}
			{/snippet}

			{#snippet Value()}
				{String(cardanoTransaction.blockSlot ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(cardanoTransaction.fee ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
