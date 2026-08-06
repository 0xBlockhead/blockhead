<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.GmxPosition> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Gmx_Rest,
		],
	}))
	const gmxPosition = $derived(viewSelection({
		fields: {
			indexName: true,
			poolName: true,
			sizeInUsd: true,
			pnl: true,
		},
	}))
	const titleFallback = $derived([(prefetched.indexName ?? ''), (prefetched.poolName ?? '')].filter(Boolean).join(' ') || 'GMX position')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import GmxMarketView from '$/views/GmxMarketView.svelte'
</script>


<EntityView
	entityType={EntityType.GmxPosition}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gmxPosition}>
			{#snippet children(entity)}
				{[(entity.indexName ?? ''), (entity.poolName ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gmxPosition}>
			{#snippet children(entity)}
				{[entity.sizeInUsd, (entity.pnl ?? '')].filter(Boolean).join(' ') || [(entity.indexName ?? ''), (entity.poolName ?? '')].filter(Boolean).join(' ') || titleFallback}
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
				<dt>Contract key</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.contractKey} />
				</dd>
			</div>

			<div>
				<dt>Market</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$market}
					>
						{#snippet children(gmxMarket)}
							<GmxMarketView
								selection={select(EntityType.GmxMarket, gmxMarket[EntityMetaKey.Selector])}
								prefetched={gmxMarket}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Long</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									isLong: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.isLong ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Collateral token</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									collateralTokenAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.collateralTokenAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Size (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={gmxPosition}
					>
						{#snippet children(entity)}
							{entity.sizeInUsd}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Size (tokens)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									sizeInTokens: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.sizeInTokens}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Collateral amount</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									collateralAmount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.collateralAmount}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							positionValueInUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const positionValueInUsd = entity.positionValueInUsd}
					{#if positionValueInUsd != null}
						<div>
							<dt>Position value (USD)</dt>
							<dd>
								{positionValueInUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={gmxPosition}
			>
				{#snippet children(entity)}
					{@const pnl = entity.pnl}
					{#if pnl != null}
						<div>
							<dt>PnL</dt>
							<dd>
								{pnl}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							leverage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const leverage = entity.leverage}
					{#if leverage != null}
						<div>
							<dt>Leverage</dt>
							<dd>
								{leverage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							entryPrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const entryPrice = entity.entryPrice}
					{#if entryPrice != null}
						<div>
							<dt>Entry price</dt>
							<dd>
								{entryPrice}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							markPrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const markPrice = entity.markPrice}
					{#if markPrice != null}
						<div>
							<dt>Mark price</dt>
							<dd>
								{markPrice}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							liquidationPrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const liquidationPrice = entity.liquidationPrice}
					{#if liquidationPrice != null}
						<div>
							<dt>Liquidation price</dt>
							<dd>
								{liquidationPrice}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={gmxPosition}
			>
				{#snippet children(entity)}
					{@const indexName = entity.indexName}
					{#if indexName != null}
						<div>
							<dt>Index name</dt>
							<dd>
								{indexName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={gmxPosition}
			>
				{#snippet children(entity)}
					{@const poolName = entity.poolName}
					{#if poolName != null}
						<div>
							<dt>Pool name</dt>
							<dd>
								{poolName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
