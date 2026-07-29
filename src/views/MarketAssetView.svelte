<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.MarketAsset> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketAsset}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.assetKey || 'Market asset')}
	href={
		href === undefined ?
			resolve(
				'/(assets)/(marketAssets)/market-asset/[kind=stringSegment]/[assetKey=stringSegment]',
				{
					kind: selection.entitySelector.kind,
					assetKey: selection.entitySelector.assetKey,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.assetKey || 'Market asset'}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.kind}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Kind</dt>
				<dd>
					{selection.entitySelector.kind}
				</dd>
			</div>

			<div>
				<dt>Asset key</dt>
				<dd>
					{selection.entitySelector.assetKey}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			{#if selection.entitySelector.kind === 'Coin'}
				<ProjectionBoundary
					resource={selection.Coin}
				>
					{#snippet Applicable(projection)}
						<div>
							<dt>Coin</dt>
							<dd>
								<ResourceBoundary
									resource={projection.$coin}
								>
									{#snippet children(coin)}
										<CoinView
											selection={select(EntityType.Coin, coin[EntityMetaKey.Selector])}
											prefetched={coin}
											layout={EntityLayout.Value}
											open={false}
										/>
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>
					{/snippet}
				</ProjectionBoundary>
			{/if}

			{#if selection.entitySelector.kind === 'CoinInstance'}
				<ProjectionBoundary
					resource={selection.CoinInstance}
				>
					{#snippet Applicable(projection)}
						<div>
							<dt>Coin instance</dt>
							<dd>
								<ResourceBoundary
									resource={projection.$coinInstance}
								>
									{#snippet children(evmCoinInstance)}
										<EvmCoinInstanceView
											selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
											prefetched={evmCoinInstance}
											layout={EntityLayout.Value}
											open={false}
										/>
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>
					{/snippet}
				</ProjectionBoundary>
			{/if}

			{#if selection.entitySelector.kind === 'Currency'}
				<ProjectionBoundary
					resource={selection.Currency}
				>
					{#snippet Applicable(projection)}
						<div>
							<dt>Currency</dt>
							<dd>
								<ResourceBoundary
									resource={projection.$currency}
								>
									{#snippet children(currency)}
										<CurrencyView
											selection={select(EntityType.Currency, currency[EntityMetaKey.Selector])}
											prefetched={currency}
											layout={EntityLayout.Value}
											open={false}
										/>
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>
					{/snippet}
				</ProjectionBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
