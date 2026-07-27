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
	}: EntitySelectionViewProps<EntityType.DydxChainSubaccount_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.DydxIndexer_Rest,
			Source.DydxValidator_Rest,
		],
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'dydx chain subaccount timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import DydxChainSubaccountView from '$/views/DydxChainSubaccountView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainSubaccount_Timestamp}
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
		<DydxChainSubaccountView
			selection={select(EntityType.DydxChainSubaccount, selection.entitySelector.$subaccount)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>subaccount</dt>
				<dd>
					<DydxChainSubaccountView
						selection={select(EntityType.DydxChainSubaccount, selection.entitySelector.$subaccount)}
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
					viewSelection({
						fields: {
							blockHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockHeight = entity.blockHeight}
					{#if blockHeight != null}
						<div>
							<dt>block height</dt>
							<dd>
								{String(blockHeight)}
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
							equity: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const equity = entity.equity}
					{#if equity != null}
						<div>
							<dt>equity</dt>
							<dd>
								{String(equity)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							freeCollateral: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const freeCollateral = entity.freeCollateral}
					{#if freeCollateral != null}
						<div>
							<dt>free collateral</dt>
							<dd>
								{String(freeCollateral)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							marginUsage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const marginUsage = entity.marginUsage}
					{#if marginUsage != null}
						<div>
							<dt>margin usage</dt>
							<dd>
								<NumberValue
									value={marginUsage}
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
							openPositionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const openPositionCount = entity.openPositionCount}
					{#if openPositionCount != null}
						<div>
							<dt>open position count</dt>
							<dd>
								<NumberValue
									value={openPositionCount}
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
							openOrderCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const openOrderCount = entity.openOrderCount}
					{#if openOrderCount != null}
						<div>
							<dt>open order count</dt>
							<dd>
								<NumberValue
									value={openOrderCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
