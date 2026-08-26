<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AaveReserve> = $props()

	const market = $derived(selection.entitySelector.$market)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Aave_Rest,
		],
	}))
	const aaveReserve = $derived(viewSelection({
		fields: {
			symbol: true,
			name: true,
		},
	}))
	const titleFallback = $derived((prefetched.symbol ?? '') || 'Aave reserve')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AaveMarketView from '$/views/AaveMarketView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.AaveReserve}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/aave-market/[poolAddress=evmAddress]/(aaveMarket)/reserve/[underlyingTokenAddress=evmAddress]',
				{
					network: (
						'caip2' in market.$network ?
							caip2StringFromValue(market.$network.caip2)
						:
							market.$network.slug
					),
					poolAddress: market.poolAddress,
					underlyingTokenAddress: selection.entitySelector.underlyingTokenAddress,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={aaveReserve}>
			{#snippet children(entity)}
				{@const reference = entity.$image}
				{#if reference != null}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={aaveReserve}>
			{#snippet children(entity)}
				{entity.symbol || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aaveReserve}>
			{#snippet children(entity)}
				{entity.name || entity.symbol || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Market</dt>
				<dd>
					<AaveMarketView
						selection={select(EntityType.AaveMarket, selection.entitySelector.$market)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Underlying token</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.underlyingTokenAddress} />
				</dd>
			</div>

			<div>
				<dt>Symbol</dt>
				<dd>
					<ResourceBoundary
						resource={aaveReserve}
					>
						{#snippet children(entity)}
							{entity.symbol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={aaveReserve}
					>
						{#snippet children(entity)}
							{entity.name}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							imageUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const imageUrl = entity.imageUrl}
					{#if imageUrl != null}
						<div>
							<dt>Image</dt>
							<dd>
								<a
									href={imageUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={imageUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Decimals</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									decimals: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.decimals}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Total supplied</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									totalSupplied: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.totalSupplied}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							availableLiquidity: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const availableLiquidity = entity.availableLiquidity}
					{#if availableLiquidity != null}
						<div>
							<dt>Available liquidity</dt>
							<dd>
								{availableLiquidity}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Supply APY</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									supplyApy: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.supplyApy}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							borrowApy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowApy = entity.borrowApy}
					{#if borrowApy != null}
						<div>
							<dt>Borrow APY</dt>
							<dd>
								{borrowApy}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							liquidationThreshold: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const liquidationThreshold = entity.liquidationThreshold}
					{#if liquidationThreshold != null}
						<div>
							<dt>Liquidation threshold</dt>
							<dd>
								{liquidationThreshold}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Frozen</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									frozen: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.frozen ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Paused</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									paused: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.paused ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
