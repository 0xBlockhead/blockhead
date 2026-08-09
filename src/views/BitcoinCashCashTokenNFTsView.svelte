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
		id = 'BitcoinCashCashTokenNFTs-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BitcoinCashCashTokenNft> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinCashCashTokenNft}
	{id}
	bind:open
	resource={
		selection({
			...{
				fields: {
					capability: true,
					$category: true,
					$commitment: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bitcoinCashCashTokenNft })}
		{@const bitcoinCashCashTokenNftSelector = bitcoinCashCashTokenNft[EntityMetaKey.Selector]}
		{@const output = bitcoinCashCashTokenNftSelector.$output}
		<EntityView
			entityType={EntityType.BitcoinCashCashTokenNft}
			entitySelector={bitcoinCashCashTokenNftSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]/(selection)/cash-token-nft',
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
				{bitcoinCashCashTokenNft.capability || 'Bitcoin Cash CashToken NFT'}
			{/snippet}

			{#snippet Value()}
				{bitcoinCashCashTokenNft.$category.categoryId || 'Bitcoin Cash CashToken category'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bitcoinCashCashTokenNft.$commitment == null ? '' : bitcoinCashCashTokenNft.$commitment.commitmentHex || 'Bitcoin Cash CashToken commitment'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
