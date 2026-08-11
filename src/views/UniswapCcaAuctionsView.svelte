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
	}: EntityListViewProps<EntityType.UniswapCcaAuction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UniswapCcaAuction}
	bind:open
	resource={
		selection({
			...{
				fields: {
					auctionAddress: true,
					$token: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: uniswapCcaAuction })}
		{@const uniswapCcaAuctionSelector = uniswapCcaAuction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.UniswapCcaAuction}
			entitySelector={uniswapCcaAuctionSelector}
			href={
				'caip2' in uniswapCcaAuctionSelector.$network ?
					resolve(
						'/(assets)/uniswap-cca/auction/[chainId=eip155ChainId]/[auctionAddress=evmAddress]',
						{
							chainId: uniswapCcaAuctionSelector.$network.caip2.reference,
							auctionAddress: uniswapCcaAuctionSelector.auctionAddress,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{uniswapCcaAuctionSelector.auctionAddress || 'Uniswap CCA auction'}
			{/snippet}

			{#snippet Value()}
				{[uniswapCcaAuction.$token.NativeCurrency.symbol, (uniswapCcaAuction.$token.NativeCurrency.name ?? ''), uniswapCcaAuction.$token.Erc20Token.symbol, (uniswapCcaAuction.$token.Erc20Token.name ?? '')].filter(Boolean).join(' ') || 'EVM coin instance'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{uniswapCcaAuction.$network.name || (uniswapCcaAuction.$network.caip2 == null ? '' : `${uniswapCcaAuction.$network.caip2.namespace}:${uniswapCcaAuction.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
