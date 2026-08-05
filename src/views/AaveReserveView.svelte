<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.AaveReserve> = $props()

	const network = $derived(selection.entitySelector.$market.$network)
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
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					poolAddress: selection.entitySelector.$market.poolAddress,
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
