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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HyperliquidBorrowLendReserve>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Hyperliquid,
		],
	}))
	const hyperliquidBorrowLendReserve = $derived(viewSelection({
		fields: {
			supplyYearlyRate: true,
			borrowYearlyRate: true,
			utilization: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import HyperliquidSpotAssetView from '$/views/HyperliquidSpotAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidBorrowLendReserve}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.tokenIndex)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.tokenIndex}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={hyperliquidBorrowLendReserve}>
			{#snippet children(entity)}
				{[(entity.supplyYearlyRate ?? ''), (entity.borrowYearlyRate ?? ''), (entity.utilization ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.tokenIndex)}
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

		<ResourceBoundary
			resource={selection.$asset}
		>
			{#snippet children(hyperliquidSpotAsset)}
				{#if hyperliquidSpotAsset != null}
					<span data-text="muted">
						<HyperliquidSpotAssetView
							selection={select(EntityType.HyperliquidSpotAsset, hyperliquidSpotAsset[EntityMetaKey.Selector])}
							prefetched={hyperliquidSpotAsset}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
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
				<dt>token index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.tokenIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$asset}
			>
				{#snippet children(hyperliquidSpotAsset)}
					{#if hyperliquidSpotAsset != null}
						<div>
							<dt>spot asset</dt>
							<dd>
								<HyperliquidSpotAssetView
									selection={select(EntityType.HyperliquidSpotAsset, hyperliquidSpotAsset[EntityMetaKey.Selector])}
									prefetched={hyperliquidSpotAsset}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={hyperliquidBorrowLendReserve}
			>
				{#snippet children(entity)}
					{@const borrowYearlyRate = entity.borrowYearlyRate}
					{#if borrowYearlyRate != null}
						<div>
							<dt>borrow yearly rate</dt>
							<dd>
								{borrowYearlyRate}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={hyperliquidBorrowLendReserve}
			>
				{#snippet children(entity)}
					{@const supplyYearlyRate = entity.supplyYearlyRate}
					{#if supplyYearlyRate != null}
						<div>
							<dt>supply yearly rate</dt>
							<dd>
								{supplyYearlyRate}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							balance: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const balance = entity.balance}
					{#if balance != null}
						<div>
							<dt>balance</dt>
							<dd>
								{balance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={hyperliquidBorrowLendReserve}
			>
				{#snippet children(entity)}
					{@const utilization = entity.utilization}
					{#if utilization != null}
						<div>
							<dt>utilization</dt>
							<dd>
								{utilization}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							oraclePx: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const oraclePx = entity.oraclePx}
					{#if oraclePx != null}
						<div>
							<dt>oracle price</dt>
							<dd>
								{oraclePx}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							ltv: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ltv = entity.ltv}
					{#if ltv != null}
						<div>
							<dt>LTV</dt>
							<dd>
								{ltv}
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
							<dt>total supplied</dt>
							<dd>
								{totalSupplied}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
							<dt>total borrowed</dt>
							<dd>
								{totalBorrowed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
