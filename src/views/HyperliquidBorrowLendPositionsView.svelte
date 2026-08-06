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
	}: EntityListViewProps<EntityType.HyperliquidBorrowLendPosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidBorrowLendPosition}
	bind:open
	resource={
		selection({
			fields: {
				tokenIndex: true,
				supplyValue: true,
				borrowValue: true,
				$account: true,
				$asset: true,
			},
		})
	}
>
	{#snippet Item({ item: hyperliquidBorrowLendPosition })}
		{@const hyperliquidBorrowLendPositionSelector = hyperliquidBorrowLendPosition[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.HyperliquidBorrowLendPosition}
			entitySelector={hyperliquidBorrowLendPositionSelector}
		>
			{#snippet Title()}
				{hyperliquidBorrowLendPositionSelector.tokenIndex}
			{/snippet}

			{#snippet Value()}
				{[(hyperliquidBorrowLendPosition.supplyValue ?? ''), (hyperliquidBorrowLendPosition.borrowValue ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{['hyperliquid account', hyperliquidBorrowLendPosition.$asset == null ? '' : (hyperliquidBorrowLendPosition.$asset.name ?? '') || String(hyperliquidBorrowLendPosition.$asset.assetId) || 'hyperliquid spot asset'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
