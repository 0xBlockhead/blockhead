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
	}: EntityListViewProps<EntityType.BitcoinCashCashTokenFungibleAmount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinCashCashTokenFungibleAmount}
	bind:open
	resource={
		selection({
			fields: {
				amount: true,
				$category: true,
			},
		})
	}
>
	{#snippet Item({ item: bitcoinCashCashTokenFungibleAmount })}
		{@const bitcoinCashCashTokenFungibleAmountSelector = bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector]}
		{@const output = bitcoinCashCashTokenFungibleAmountSelector.$output}
		<EntityView
			entityType={EntityType.BitcoinCashCashTokenFungibleAmount}
			entitySelector={bitcoinCashCashTokenFungibleAmountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]/(selection)/cash-token-fungible',
					{
						network: (
							'caip2' in output.$transaction.$network ?
								caip2StringFromValue(output.$transaction.$network.caip2)
							:
								output.$transaction.$network.slug
						),
						transactionId: output.$transaction.txId,
						outputIndex: String(output.indexInTransaction),
					}
				)
			}
		>
			{#snippet Title()}
				{bitcoinCashCashTokenFungibleAmount.amount}
			{/snippet}

			{#snippet Value()}
				{bitcoinCashCashTokenFungibleAmount.amount}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bitcoinCashCashTokenFungibleAmount.$category.categoryId || 'Bitcoin Cash CashToken category'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
