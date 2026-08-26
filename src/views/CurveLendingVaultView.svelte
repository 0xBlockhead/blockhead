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
	}: EntitySelectionViewProps<EntityType.CurveLendingVault> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Curve_Rest,
		],
	}))
	const curveLendingVault = $derived(viewSelection({
		fields: {
			name: true,
			lendApy: true,
			borrowApy: true,
			usdTotal: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || 'Curve Lend vault')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import CurveGaugeView from '$/views/CurveGaugeView.svelte'
</script>


<EntityView
	entityType={EntityType.CurveLendingVault}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/curve/lending-vault/[vaultAddress=evmAddress]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					vaultAddress: selection.entitySelector.vaultAddress,
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
		<ResourceBoundary resource={curveLendingVault}>
			{#snippet children(entity)}
				{entity.name || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={curveLendingVault}>
			{#snippet children(entity)}
				{[String(entity.lendApy ?? ''), String(entity.borrowApy ?? ''), String(entity.usdTotal ?? '')].filter(Boolean).join(' ') || entity.name || titleFallback}
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
				<dt>Vault address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.vaultAddress} />
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={curveLendingVault}
					>
						{#snippet children(entity)}
							{entity.name}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Registry ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									registryId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.registryId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Controller address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									controllerAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.controllerAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>AMM address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									ammAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.ammAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Monetary policy address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									monetaryPolicyAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.monetaryPolicyAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$gauge}
			>
				{#snippet children(curveGauge)}
					{#if curveGauge != null}
						{@const curveGaugeInitial = untrack(() => curveGauge)}
						<div>
							<dt>Gauge</dt>
							<dd>
								<CurveGaugeView
									selection={select(EntityType.CurveGauge, (curveGauge ?? curveGaugeInitial)[EntityMetaKey.Selector])}
									prefetched={curveGauge ?? curveGaugeInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Borrowed asset address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									borrowedAssetAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.borrowedAssetAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Borrowed asset symbol</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									borrowedAssetSymbol: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.borrowedAssetSymbol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Borrowed asset decimals</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									borrowedAssetDecimals: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.borrowedAssetDecimals}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							borrowedAssetUsdPrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowedAssetUsdPrice = entity.borrowedAssetUsdPrice}
					{#if borrowedAssetUsdPrice != null}
						<div>
							<dt>Borrowed asset USD price</dt>
							<dd>
								<NumberValue
									value={borrowedAssetUsdPrice}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Collateral asset address</dt>
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
				<dt>Collateral asset symbol</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									collateralAssetSymbol: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.collateralAssetSymbol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Collateral asset decimals</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									collateralAssetDecimals: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.collateralAssetDecimals}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							collateralAssetUsdPrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const collateralAssetUsdPrice = entity.collateralAssetUsdPrice}
					{#if collateralAssetUsdPrice != null}
						<div>
							<dt>Collateral asset USD price</dt>
							<dd>
								<NumberValue
									value={collateralAssetUsdPrice}
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
							borrowApr: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowApr = entity.borrowApr}
					{#if borrowApr != null}
						<div>
							<dt>Borrow APR</dt>
							<dd>
								<NumberValue
									value={borrowApr}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={curveLendingVault}
			>
				{#snippet children(entity)}
					{@const borrowApy = entity.borrowApy}
					{#if borrowApy != null}
						<div>
							<dt>Borrow APY</dt>
							<dd>
								<NumberValue
									value={borrowApy}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lendApr: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lendApr = entity.lendApr}
					{#if lendApr != null}
						<div>
							<dt>Lend APR</dt>
							<dd>
								<NumberValue
									value={lendApr}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={curveLendingVault}
			>
				{#snippet children(entity)}
					{@const lendApy = entity.lendApy}
					{#if lendApy != null}
						<div>
							<dt>Lend APY</dt>
							<dd>
								<NumberValue
									value={lendApy}
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
							pricePerShare: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pricePerShare = entity.pricePerShare}
					{#if pricePerShare != null}
						<div>
							<dt>Price per share</dt>
							<dd>
								<NumberValue
									value={pricePerShare}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							totalShares: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalShares = entity.totalShares}
					{#if totalShares != null}
						<div>
							<dt>Total shares</dt>
							<dd>
								<NumberValue
									value={totalShares}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const totalSupplied = entity.totalSupplied}
					{#if totalSupplied != null}
						<div>
							<dt>Total supplied</dt>
							<dd>
								<NumberValue
									value={totalSupplied}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							totalSuppliedUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalSuppliedUsd = entity.totalSuppliedUsd}
					{#if totalSuppliedUsd != null}
						<div>
							<dt>Total supplied (USD)</dt>
							<dd>
								<NumberValue
									value={totalSuppliedUsd}
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
							totalBorrowed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalBorrowed = entity.totalBorrowed}
					{#if totalBorrowed != null}
						<div>
							<dt>Total borrowed</dt>
							<dd>
								<NumberValue
									value={totalBorrowed}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							totalBorrowedUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalBorrowedUsd = entity.totalBorrowedUsd}
					{#if totalBorrowedUsd != null}
						<div>
							<dt>Total borrowed (USD)</dt>
							<dd>
								<NumberValue
									value={totalBorrowedUsd}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							availableToBorrow: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const availableToBorrow = entity.availableToBorrow}
					{#if availableToBorrow != null}
						<div>
							<dt>Available to borrow</dt>
							<dd>
								<NumberValue
									value={availableToBorrow}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							availableToBorrowUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const availableToBorrowUsd = entity.availableToBorrowUsd}
					{#if availableToBorrowUsd != null}
						<div>
							<dt>Available to borrow (USD)</dt>
							<dd>
								<NumberValue
									value={availableToBorrowUsd}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={curveLendingVault}
			>
				{#snippet children(entity)}
					{@const usdTotal = entity.usdTotal}
					{#if usdTotal != null}
						<div>
							<dt>Total value (USD)</dt>
							<dd>
								<NumberValue
									value={usdTotal}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
