<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.DydxChainSubaccount_Timestamp>, 'prefetched'> = $props()

	const subaccount = $derived(selection.entitySelector.$subaccount)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.DydxIndexer,
			Source.KingnodesDydxNode,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import DydxChainSubaccountView from '$/views/DydxChainSubaccountView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainSubaccount_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			(
				'caip2' in subaccount.$account.$network ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[accountAddress=stringSegment]/subaccount/[subaccountNumber=nonNegativeInteger]/(dydxChainSubaccount)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							network: String(subaccount.$account.$network.caip2),
							accountAddress: subaccount.$account.address,
							subaccountNumber: String(subaccount.subaccountNumber),
							timestampMs: String(selection.entitySelector.timestampMs),
							source: selection.entitySelector.source,
						}
					)
				:
					undefined
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
		<DydxChainSubaccountView
			selection={select(EntityType.DydxChainSubaccount, selection.entitySelector.$subaccount)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>subaccount</dt>
				<dd>
					<DydxChainSubaccountView
						selection={select(EntityType.DydxChainSubaccount, selection.entitySelector.$subaccount)}
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
								{blockHeight}
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
								{equity}
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
								{freeCollateral}
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
