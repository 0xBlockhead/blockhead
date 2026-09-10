<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.UniswapCcaAuction_EvmBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UniswapCcaAuction_EvmBlock}
	bind:open
	resource={
		selection({
			fields: {
				blockNumber: true,
				schedulePhase: true,
				isGraduated: true,
				$auction: true,
			},
		})
	}
>
	{#snippet Item({ item: uniswapCcaAuctionEvmBlock })}
		{@const uniswapCcaAuctionEvmBlockSelector = uniswapCcaAuctionEvmBlock[EntityMetaKey.Selector]}
		{@const auction = uniswapCcaAuctionEvmBlockSelector.$auction}
		<EntityView
			entityType={EntityType.UniswapCcaAuction_EvmBlock}
			entitySelector={uniswapCcaAuctionEvmBlockSelector}
			href={
				'caip2' in auction.$network ?
					resolve(
						'/(assets)/uniswap-cca/auction/[chainId=eip155ChainId]/[auctionAddress=evmAddress]/(uniswapCcaAuction)/block/[blockNumber=nonNegativeBigInt]',
						{
							chainId: auction.$network.caip2.reference,
							auctionAddress: auction.auctionAddress,
							blockNumber: String(uniswapCcaAuctionEvmBlockSelector.blockNumber),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{uniswapCcaAuctionEvmBlockSelector.blockNumber}
			{/snippet}

			{#snippet Value()}
				{[uniswapCcaAuctionEvmBlock.schedulePhase, String(uniswapCcaAuctionEvmBlock.isGraduated)].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{uniswapCcaAuctionEvmBlockSelector.$auction.auctionAddress || 'Uniswap CCA auction'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
