<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.MarketAsset>, 'prefetched'> = $props()


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
	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.kind}
		</span>
	{/snippet}

	{#snippet Content()}
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
									{@const coinInitial = untrack(() => coin)}
									<CoinView
										selection={select(EntityType.Coin, (coin ?? coinInitial)[EntityMetaKey.Selector])}
										prefetched={coin ?? coinInitial}
										layout={EntityLayout.Value}
									/>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/snippet}
			</ProjectionBoundary>

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
										layout={EntityLayout.Value}
									/>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/snippet}
			</ProjectionBoundary>

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
									{@const currencyInitial = untrack(() => currency)}
									<CurrencyView
										selection={select(EntityType.Currency, (currency ?? currencyInitial)[EntityMetaKey.Selector])}
										prefetched={currency ?? currencyInitial}
										layout={EntityLayout.Value}
									/>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/snippet}
			</ProjectionBoundary>
		</dl>
	{/snippet}
</EntityView>
