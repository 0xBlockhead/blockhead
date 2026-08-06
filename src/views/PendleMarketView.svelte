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
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.PendleMarket> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Pendle_Rest,
		],
	}))
	const pendleMarket = $derived(viewSelection({
		fields: {
			name: true,
			impliedApy: true,
			underlyingApy: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || 'Pendle market')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.PendleMarket}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={pendleMarket}>
			{#snippet children(entity)}
				{entity.name || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={pendleMarket}>
			{#snippet children(entity)}
				{[String(entity.impliedApy), String(entity.underlyingApy)].filter(Boolean).join(' ') || entity.name || titleFallback}
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
				<dt>Market address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.marketAddress} />
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={pendleMarket}
					>
						{#snippet children(entity)}
							{entity.name}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Protocol</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									protocol: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.protocol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Expiry</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									expiryTimestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.expiryTimestampMs} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>PT address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									ptAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.ptAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>YT address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									ytAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.ytAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>SY address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									syAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.syAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Underlying asset address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									underlyingAssetAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.underlyingAssetAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Implied APY</dt>
				<dd>
					<ResourceBoundary
						resource={pendleMarket}
					>
						{#snippet children(entity)}
							{entity.impliedApy}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Underlying APY</dt>
				<dd>
					<ResourceBoundary
						resource={pendleMarket}
					>
						{#snippet children(entity)}
							{entity.underlyingApy}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Total TVL (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									totalTvlUsd: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.totalTvlUsd}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Liquidity (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									liquidityUsd: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.liquidityUsd}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Trading volume (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									tradingVolumeUsd: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.tradingVolumeUsd}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Fee rate</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									feeRate: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.feeRate}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Total PT</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									totalPt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.totalPt}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Total SY</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									totalSy: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.totalSy}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Total supply</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									totalSupply: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.totalSupply}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Prime</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									isPrime: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.isPrime ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>New</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									isNew: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.isNew ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Observed at</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									observedAtTimestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.observedAtTimestampMs} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
