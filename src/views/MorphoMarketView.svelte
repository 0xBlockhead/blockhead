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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.MorphoMarket>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Morpho_Graphql,
			Source.Morpho_Rest,
		],
	}))
	const morphoMarket = $derived(viewSelection({
		fields: {
			lltvWad: true,
			utilization: true,
			supplyApy: true,
			borrowApy: true,
			totalSupplyAssets: true,
			totalBorrowAssets: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.marketId || 'Morpho market')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.MorphoMarket}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/morpho-market/[marketId=evmTxHash]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					marketId: selection.entitySelector.marketId,
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
		<TruncatedValue value={selection.entitySelector.marketId} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={morphoMarket}>
			{#snippet children(entity)}
				{[entity.lltvWad, String(entity.utilization ?? ''), String(entity.supplyApy ?? ''), String(entity.borrowApy ?? ''), (entity.totalSupplyAssets ?? ''), (entity.totalBorrowAssets ?? '')].filter(Boolean).join(' ') || selection.entitySelector.marketId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>
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
				<dt>Market ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.marketId} />
				</dd>
			</div>

			<div>
				<dt>Loan asset</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									loanAssetAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.loanAssetAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Collateral asset</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									collateralAssetAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.collateralAssetAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Oracle</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									oracleAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.oracleAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>IRM</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									irmAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.irmAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>LLTV (WAD)</dt>
				<dd>
					<ResourceBoundary
						resource={morphoMarket}
					>
						{#snippet children(entity)}
							{entity.lltvWad}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							creationBlockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const creationBlockNumber = entity.creationBlockNumber}
					{#if creationBlockNumber != null}
						<div>
							<dt>Creation block</dt>
							<dd>
								{creationBlockNumber}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={morphoMarket}
			>
				{#snippet children(entity)}
					{@const totalSupplyAssets = entity.totalSupplyAssets}
					{#if totalSupplyAssets != null}
						<div>
							<dt>Total supply assets</dt>
							<dd>
								{totalSupplyAssets}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							totalSupplyShares: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalSupplyShares = entity.totalSupplyShares}
					{#if totalSupplyShares != null}
						<div>
							<dt>Total supply shares</dt>
							<dd>
								{totalSupplyShares}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={morphoMarket}
			>
				{#snippet children(entity)}
					{@const totalBorrowAssets = entity.totalBorrowAssets}
					{#if totalBorrowAssets != null}
						<div>
							<dt>Total borrow assets</dt>
							<dd>
								{totalBorrowAssets}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							totalBorrowShares: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalBorrowShares = entity.totalBorrowShares}
					{#if totalBorrowShares != null}
						<div>
							<dt>Total borrow shares</dt>
							<dd>
								{totalBorrowShares}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							feeWad: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeWad = entity.feeWad}
					{#if feeWad != null}
						<div>
							<dt>Fee (WAD)</dt>
							<dd>
								{feeWad}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={morphoMarket}
			>
				{#snippet children(entity)}
					{@const utilization = entity.utilization}
					{#if utilization != null}
						<div>
							<dt>Utilization</dt>
							<dd>
								{utilization}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={morphoMarket}
			>
				{#snippet children(entity)}
					{@const supplyApy = entity.supplyApy}
					{#if supplyApy != null}
						<div>
							<dt>Supply APY</dt>
							<dd>
								{supplyApy}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={morphoMarket}
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
							netSupplyApy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const netSupplyApy = entity.netSupplyApy}
					{#if netSupplyApy != null}
						<div>
							<dt>Net supply APY</dt>
							<dd>
								{netSupplyApy}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							netBorrowApy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const netBorrowApy = entity.netBorrowApy}
					{#if netBorrowApy != null}
						<div>
							<dt>Net borrow APY</dt>
							<dd>
								{netBorrowApy}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							liquidityAssets: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const liquidityAssets = entity.liquidityAssets}
					{#if liquidityAssets != null}
						<div>
							<dt>Liquidity assets</dt>
							<dd>
								{liquidityAssets}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							collateralAssets: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const collateralAssets = entity.collateralAssets}
					{#if collateralAssets != null}
						<div>
							<dt>Collateral assets</dt>
							<dd>
								{collateralAssets}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
							collateralAssetsUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const collateralAssetsUsd = entity.collateralAssetsUsd}
					{#if collateralAssetsUsd != null}
						<div>
							<dt>Collateral assets (USD)</dt>
							<dd>
								{collateralAssetsUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							liquidityAssetsUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const liquidityAssetsUsd = entity.liquidityAssetsUsd}
					{#if liquidityAssetsUsd != null}
						<div>
							<dt>Liquidity assets (USD)</dt>
							<dd>
								{liquidityAssetsUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lastIndexedBlock: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastIndexedBlock = entity.lastIndexedBlock}
					{#if lastIndexedBlock != null}
						<div>
							<dt>Last indexed block</dt>
							<dd>
								{lastIndexedBlock}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lastAccrualTimestamp: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastAccrualTimestamp = entity.lastAccrualTimestamp}
					{#if lastAccrualTimestamp != null}
						<div>
							<dt>Last accrual</dt>
							<dd>
								<Timestamp timestamp={lastAccrualTimestamp} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
