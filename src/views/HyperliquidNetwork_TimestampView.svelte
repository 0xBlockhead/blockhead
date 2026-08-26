<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HyperliquidNetwork_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Hyperliquid,
		],
	}))
	const hyperliquidNetworkTimestamp = $derived(viewSelection({
		fields: {
			perpMarketCount: true,
			totalStake: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={hyperliquidNetworkTimestamp}>
			{#snippet children(entity)}
				{[String(entity.perpMarketCount ?? ''), String(entity.totalStake ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={hyperliquidNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const perpMarketCount = entity.perpMarketCount}
					{#if perpMarketCount != null}
						<div>
							<dt>perp market count</dt>
							<dd>
								<NumberValue
									value={perpMarketCount}
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
								<NumberValue
									value={spotAssetCount}
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
								<NumberValue
									value={spotPairCount}
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
								<NumberValue
									value={validatorCount}
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
								<NumberValue
									value={activeValidatorCount}
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
								<NumberValue
									value={jailedValidatorCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={hyperliquidNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const totalStake = entity.totalStake}
					{#if totalStake != null}
						<div>
							<dt>total stake</dt>
							<dd>
								<NumberValue
									value={totalStake}
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
								<NumberValue
									value={borrowLendReserveCount}
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
								<NumberValue
									value={vaultCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
