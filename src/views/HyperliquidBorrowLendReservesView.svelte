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
	}: EntityListViewProps<EntityType.HyperliquidBorrowLendReserve> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidBorrowLendReserve}
	bind:open
	resource={
		selection({
			fields: {
				tokenIndex: true,
				supplyYearlyRate: true,
				borrowYearlyRate: true,
				utilization: true,
				$network: true,
				$asset: true,
			},
		})
	}
>
	{#snippet Item({ item: hyperliquidBorrowLendReserve })}
		{@const hyperliquidBorrowLendReserveSelector = hyperliquidBorrowLendReserve[EntityMetaKey.Selector]}
		{@const network = hyperliquidBorrowLendReserveSelector.$network}
		<EntityView
			entityType={EntityType.HyperliquidBorrowLendReserve}
			entitySelector={hyperliquidBorrowLendReserveSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/borrow-lend/reserve/[tokenIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						tokenIndex: String(hyperliquidBorrowLendReserveSelector.tokenIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{hyperliquidBorrowLendReserveSelector.tokenIndex}
			{/snippet}

			{#snippet Value()}
				{[(hyperliquidBorrowLendReserve.supplyYearlyRate ?? ''), (hyperliquidBorrowLendReserve.borrowYearlyRate ?? ''), (hyperliquidBorrowLendReserve.utilization ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[hyperliquidBorrowLendReserve.$network.name || (hyperliquidBorrowLendReserve.$network.caip2 == null ? '' : `${hyperliquidBorrowLendReserve.$network.caip2.namespace}:${hyperliquidBorrowLendReserve.$network.caip2.reference}`) || 'Network', hyperliquidBorrowLendReserve.$asset == null ? '' : (hyperliquidBorrowLendReserve.$asset.name ?? '') || String(hyperliquidBorrowLendReserve.$asset.assetId) || 'hyperliquid spot asset'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
