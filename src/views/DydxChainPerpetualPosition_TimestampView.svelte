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
	}: Omit<EntitySelectionViewProps<EntityType.DydxChainPerpetualPosition_Timestamp>, 'prefetched'> = $props()

	const subaccount = $derived(selection.entitySelector.$subaccount)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.DydxIndexer,
			Source.KingnodesDydxNode,
		],
	}))
	const dydxChainPerpetualPositionTimestamp = $derived(viewSelection({
		fields: {
			side: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import DydxChainSubaccountView from '$/views/DydxChainSubaccountView.svelte'
	import DydxChainMarketView from '$/views/DydxChainMarketView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainPerpetualPosition_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			(
				'caip2' in subaccount.$account.$network ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[accountAddress=stringSegment]/subaccount/[subaccountNumber=nonNegativeInteger]/(dydxChainSubaccount)/market/[ticker=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							network: String(subaccount.$account.$network.caip2),
							accountAddress: subaccount.$account.address,
							subaccountNumber: String(subaccount.subaccountNumber),
							ticker: selection.entitySelector.$market.ticker,
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
		<ResourceBoundary resource={dydxChainPerpetualPositionTimestamp}>
			{#snippet children(entity)}
				{(entity.side ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
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
				<dt>market</dt>
				<dd>
					<DydxChainMarketView
						selection={select(EntityType.DydxChainMarket, selection.entitySelector.$market)}
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
				resource={dydxChainPerpetualPositionTimestamp}
			>
				{#snippet children(entity)}
					{@const side = entity.side}
					{#if side != null}
						<div>
							<dt>side</dt>
							<dd>
								{side}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							size: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const size = entity.size}
					{#if size != null}
						<div>
							<dt>size</dt>
							<dd>
								{size}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							entryPrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const entryPrice = entity.entryPrice}
					{#if entryPrice != null}
						<div>
							<dt>entry price</dt>
							<dd>
								{entryPrice}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							unrealizedPnl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const unrealizedPnl = entity.unrealizedPnl}
					{#if unrealizedPnl != null}
						<div>
							<dt>unrealized pnl</dt>
							<dd>
								{unrealizedPnl}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							realizedPnl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const realizedPnl = entity.realizedPnl}
					{#if realizedPnl != null}
						<div>
							<dt>realized pnl</dt>
							<dd>
								{realizedPnl}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							netFunding: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const netFunding = entity.netFunding}
					{#if netFunding != null}
						<div>
							<dt>net funding</dt>
							<dd>
								{netFunding}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
