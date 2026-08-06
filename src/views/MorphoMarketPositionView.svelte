<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.MorphoMarketPosition>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Morpho_Graphql,
		],
	}))
	const morphoMarketPosition = $derived(viewSelection({
		fields: {
			supplyAssets: true,
			borrowAssets: true,
			collateral: true,
		},
	}))
	const titleFallback = 'Morpho market position'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import MorphoMarketView from '$/views/MorphoMarketView.svelte'
</script>


<EntityView
	entityType={EntityType.MorphoMarketPosition}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<MorphoMarketView
			selection={select(EntityType.MorphoMarket, selection.entitySelector.$market)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={morphoMarketPosition}>
			{#snippet children(entity)}
				{[entity.supplyAssets, entity.borrowAssets, entity.collateral].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Market</dt>
				<dd>
					<MorphoMarketView
						selection={select(EntityType.MorphoMarket, selection.entitySelector.$market)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Supply assets</dt>
				<dd>
					<ResourceBoundary
						resource={morphoMarketPosition}
					>
						{#snippet children(entity)}
							{entity.supplyAssets}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Supply shares</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									supplyShares: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.supplyShares}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Borrow assets</dt>
				<dd>
					<ResourceBoundary
						resource={morphoMarketPosition}
					>
						{#snippet children(entity)}
							{entity.borrowAssets}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Borrow shares</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									borrowShares: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.borrowShares}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Collateral</dt>
				<dd>
					<ResourceBoundary
						resource={morphoMarketPosition}
					>
						{#snippet children(entity)}
							{entity.collateral}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							supplyAssetsUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supplyAssetsUsd = entity.supplyAssetsUsd}
					{#if supplyAssetsUsd != null}
						<div>
							<dt>Supply assets (USD)</dt>
							<dd>
								{supplyAssetsUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							borrowAssetsUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowAssetsUsd = entity.borrowAssetsUsd}
					{#if borrowAssetsUsd != null}
						<div>
							<dt>Borrow assets (USD)</dt>
							<dd>
								{borrowAssetsUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							collateralUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const collateralUsd = entity.collateralUsd}
					{#if collateralUsd != null}
						<div>
							<dt>Collateral (USD)</dt>
							<dd>
								{collateralUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
