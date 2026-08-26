<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: EntitySelectionViewProps<EntityType.OsmosisPool> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Osmosis_LCD_Rest,
		],
	}))
	const osmosisPool = $derived(viewSelection({
		fields: {
			typeUrl: true,
			swapFee: true,
			exitFee: true,
			liquidityKind: true,
		},
	}))
	const titleFallback = $derived([selection.entitySelector.poolId, (prefetched.typeUrl ?? '')].filter(Boolean).join(' ') || 'Osmosis pool')
	const viewDomId = $derived('osmosis-pool-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import OsmosisPoolAssetsView from '$/views/OsmosisPoolAssetsView.svelte'
	import OsmosisPool_TimestampsView from '$/views/OsmosisPool_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.OsmosisPool}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/osmosis-pool/[poolId=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					poolId: selection.entitySelector.poolId,
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
		<ResourceBoundary resource={osmosisPool}>
			{#snippet children(entity)}
				{[selection.entitySelector.poolId, (entity.typeUrl ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={osmosisPool}>
			{#snippet children(entity)}
				{[(entity.swapFee ?? ''), (entity.exitFee ?? '')].filter(Boolean).join(' ') || [selection.entitySelector.poolId, (entity.typeUrl ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={osmosisPool}>
			{#snippet children(entity)}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Title}
					/>
				</span>
				{@const liquidityKind = entity.liquidityKind}
				{#if liquidityKind != null}
					<span data-text="muted">
						{liquidityKind}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Pool ID</dt>
				<dd>
					{selection.entitySelector.poolId}
				</dd>
			</div>

			<ResourceBoundary
				resource={osmosisPool}
			>
				{#snippet children(entity)}
					{@const typeUrl = entity.typeUrl}
					{#if typeUrl != null}
						<div>
							<dt>Type URL</dt>
							<dd>
								<a
									href={typeUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={typeUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={osmosisPool}
			>
				{#snippet children(entity)}
					{@const liquidityKind = entity.liquidityKind}
					{#if liquidityKind != null}
						<div>
							<dt>Liquidity kind</dt>
							<dd>
								{liquidityKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							address: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const address = entity.address}
					{#if address != null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={address} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={osmosisPool}
			>
				{#snippet children(entity)}
					{@const swapFee = entity.swapFee}
					{#if swapFee != null}
						<div>
							<dt>Swap fee</dt>
							<dd>
								{swapFee}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={osmosisPool}
			>
				{#snippet children(entity)}
					{@const exitFee = entity.exitFee}
					{#if exitFee != null}
						<div>
							<dt>Exit fee</dt>
							<dd>
								{exitFee}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							spreadFactor: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spreadFactor = entity.spreadFactor}
					{#if spreadFactor != null}
						<div>
							<dt>Spread factor</dt>
							<dd>
								{spreadFactor}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							totalWeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalWeight = entity.totalWeight}
					{#if totalWeight != null}
						<div>
							<dt>Total weight</dt>
							<dd>
								{totalWeight}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							totalSharesAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalSharesAmount = entity.totalSharesAmount}
					{#if totalSharesAmount != null}
						<div>
							<dt>Total shares amount</dt>
							<dd>
								{totalSharesAmount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							totalSharesDenom: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalSharesDenom = entity.totalSharesDenom}
					{#if totalSharesDenom != null}
						<div>
							<dt>Total shares denom</dt>
							<dd>
								{totalSharesDenom}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lastLiquidityUpdate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastLiquidityUpdate = entity.lastLiquidityUpdate}
					{#if lastLiquidityUpdate != null}
						<div>
							<dt>Last liquidity update</dt>
							<dd>
								{lastLiquidityUpdate}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							positionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const positionCount = entity.positionCount}
					{#if positionCount != null}
						<div>
							<dt>Position count</dt>
							<dd>
								<NumberValue
									value={positionCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							token0Denom: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const token0Denom = entity.token0Denom}
					{#if token0Denom != null}
						<div>
							<dt>Token 0 denom</dt>
							<dd>
								{token0Denom}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							token1Denom: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const token1Denom = entity.token1Denom}
					{#if token1Denom != null}
						<div>
							<dt>Token 1 denom</dt>
							<dd>
								{token1Denom}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							currentSqrtPrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const currentSqrtPrice = entity.currentSqrtPrice}
					{#if currentSqrtPrice != null}
						<div>
							<dt>Current sqrt price</dt>
							<dd>
								{currentSqrtPrice}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							currentTick: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const currentTick = entity.currentTick}
					{#if currentTick != null}
						<div>
							<dt>Current tick</dt>
							<dd>
								{currentTick}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							currentTickLiquidity: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const currentTickLiquidity = entity.currentTickLiquidity}
					{#if currentTickLiquidity != null}
						<div>
							<dt>Current tick liquidity</dt>
							<dd>
								{currentTickLiquidity}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							tickSpacing: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tickSpacing = entity.tickSpacing}
					{#if tickSpacing != null}
						<div>
							<dt>Tick spacing</dt>
							<dd>
								{tickSpacing}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							exponentAtPriceOne: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const exponentAtPriceOne = entity.exponentAtPriceOne}
					{#if exponentAtPriceOne != null}
						<div>
							<dt>Exponent at price one</dt>
							<dd>
								{exponentAtPriceOne}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-osmosis-pool-balances'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'osmosis-pool-assets',
						label: 'Assets',
					},
					{
						id: 'osmosis-pool-spot',
						label: 'Spot prices',
					},
				]
			}
			data-card
			class='network-view-collapsible-balances'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Balances and spot</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionOsmosisPoolAssets({ id, label })}
				<OsmosisPoolAssetsView
					selection={
						selection
						.$$assets({
							sources: [
								Source.Osmosis_LCD_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					emptyText='No pool assets.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionOsmosisPoolSpot({ id, label })}
				<OsmosisPool_TimestampsView
					selection={
						selection
						.$$timestamps({
							sources: [
								Source.Osmosis_LCD_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					emptyText='No spot price observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
