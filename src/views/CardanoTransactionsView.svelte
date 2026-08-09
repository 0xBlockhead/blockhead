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
			...{
				fields: {
					hash: true,
					blockSlot: true,
					fee: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: cardanoTransaction })}
		{@const cardanoTransactionSelector = cardanoTransaction[EntityMetaKey.Selector]}
		{@const network = cardanoTransactionSelector.$network}
		<EntityView
			entityType={EntityType.CardanoTransaction}
			entitySelector={cardanoTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						transactionId: cardanoTransactionSelector.hash,
					}
				)
			}
		>
			{#snippet Title()}
				{cardanoTransactionSelector.hash || 'Cardano transaction'}
			{/snippet}

			{#snippet Value()}
				{cardanoTransaction.blockSlot ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cardanoTransaction.fee ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
