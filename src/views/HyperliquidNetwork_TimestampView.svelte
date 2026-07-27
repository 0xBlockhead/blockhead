<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.HyperliquidNetwork_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'hyperliquid network timestamp'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		hyperliquid network timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							perpMarketCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const perpMarketCount = entity.perpMarketCount}
					{#if perpMarketCount != null}
						<div>
							<dt>perp market count</dt>
							<dd>
								{String(perpMarketCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spotAssetCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spotAssetCount = entity.spotAssetCount}
					{#if spotAssetCount != null}
						<div>
							<dt>spot asset count</dt>
							<dd>
								{String(spotAssetCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spotPairCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spotPairCount = entity.spotPairCount}
					{#if spotPairCount != null}
						<div>
							<dt>spot pair count</dt>
							<dd>
								{String(spotPairCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							validatorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const validatorCount = entity.validatorCount}
					{#if validatorCount != null}
						<div>
							<dt>validator count</dt>
							<dd>
								{String(validatorCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activeValidatorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activeValidatorCount = entity.activeValidatorCount}
					{#if activeValidatorCount != null}
						<div>
							<dt>active validator count</dt>
							<dd>
								{String(activeValidatorCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							jailedValidatorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const jailedValidatorCount = entity.jailedValidatorCount}
					{#if jailedValidatorCount != null}
						<div>
							<dt>jailed validator count</dt>
							<dd>
								{String(jailedValidatorCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalStake: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalStake = entity.totalStake}
					{#if totalStake != null}
						<div>
							<dt>total stake</dt>
							<dd>
								{String(totalStake)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							borrowLendReserveCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowLendReserveCount = entity.borrowLendReserveCount}
					{#if borrowLendReserveCount != null}
						<div>
							<dt>borrow lend reserve count</dt>
							<dd>
								{String(borrowLendReserveCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							vaultCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const vaultCount = entity.vaultCount}
					{#if vaultCount != null}
						<div>
							<dt>vault count</dt>
							<dd>
								{String(vaultCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
