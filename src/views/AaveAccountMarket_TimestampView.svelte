<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.AaveAccountMarket_Timestamp>, 'prefetched'> = $props()

	const accountMarket = $derived(selection.entitySelector.$accountMarket)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Aave_Rest,
		],
	}))
	const aaveAccountMarketTimestamp = $derived(viewSelection({
		fields: {
			healthFactor: true,
			ltv: true,
			totalCollateralBase: true,
			totalDebtBase: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AaveAccountMarketView from '$/views/AaveAccountMarketView.svelte'
</script>


<EntityView
	entityType={EntityType.AaveAccountMarket_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/aave-market/[poolAddress=evmAddress]/(aaveAccountMarket)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						accountMarket.$account.$network.caip2 !== undefined ?
							caip2StringFromValue(accountMarket.$account.$network.caip2)
						:
							accountMarket.$account.$network.slug
					),
					accountId: accountMarket.$account.$actor.address,
					poolAddress: accountMarket.$market.poolAddress,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aaveAccountMarketTimestamp}>
			{#snippet children(entity)}
				{[(entity.healthFactor ?? ''), entity.ltv, entity.totalCollateralBase, entity.totalDebtBase].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Account market</dt>
				<dd>
					<AaveAccountMarketView
						selection={select(EntityType.AaveAccountMarket, selection.entitySelector.$accountMarket)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={aaveAccountMarketTimestamp}
			>
				{#snippet children(entity)}
					{@const healthFactor = entity.healthFactor}
					{#if healthFactor != null}
						<div>
							<dt>Health factor</dt>
							<dd>
								{healthFactor}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Liquidation threshold</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									currentLiquidationThreshold: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.currentLiquidationThreshold}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>LTV</dt>
				<dd>
					<ResourceBoundary
						resource={aaveAccountMarketTimestamp}
					>
						{#snippet children(entity)}
							{entity.ltv}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Total collateral</dt>
				<dd>
					<ResourceBoundary
						resource={aaveAccountMarketTimestamp}
					>
						{#snippet children(entity)}
							{entity.totalCollateralBase}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Total debt</dt>
				<dd>
					<ResourceBoundary
						resource={aaveAccountMarketTimestamp}
					>
						{#snippet children(entity)}
							{entity.totalDebtBase}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Available borrows</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									availableBorrowsBase: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.availableBorrowsBase}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Net APY</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									netApy: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.netApy}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
