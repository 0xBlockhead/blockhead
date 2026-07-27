<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntitySelectionViewProps<EntityType.DydxChainMarket_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.DydxIndexer_Rest,
			Source.DydxValidator_Rest,
		],
	}))
	const dydxChainMarketTimestamp = $derived(viewSelection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'dydx chain market timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import DydxChainMarketView from '$/views/DydxChainMarketView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainMarket_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={dydxChainMarketTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || String(pendingEntity.timestampMs) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>market</dt>
				<dd>
					<DydxChainMarketView
						selection={select(EntityType.DydxChainMarket, selection.entitySelector.$market)}
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
				resource={dydxChainMarketTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
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
							oraclePrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const oraclePrice = entity.oraclePrice}
					{#if oraclePrice != null}
						<div>
							<dt>oracle price</dt>
							<dd>
								{String(oraclePrice)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fundingRate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fundingRate = entity.fundingRate}
					{#if fundingRate != null}
						<div>
							<dt>funding rate</dt>
							<dd>
								<NumberValue
									value={fundingRate}
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
							openInterest: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const openInterest = entity.openInterest}
					{#if openInterest != null}
						<div>
							<dt>open interest</dt>
							<dd>
								{String(openInterest)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							nextFundingAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nextFundingAtMs = entity.nextFundingAtMs}
					{#if nextFundingAtMs != null}
						<div>
							<dt>next funding at ms</dt>
							<dd>
								<Timestamp timestamp={Number(nextFundingAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
