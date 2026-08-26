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
	}: Omit<EntitySelectionViewProps<EntityType.DydxChainPerpetualPosition_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.DydxIndexer,
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
	import DydxChainPerpetualPositionView from '$/views/DydxChainPerpetualPositionView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainPerpetualPosition_Timestamp}
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
		<ResourceBoundary resource={dydxChainPerpetualPositionTimestamp}>
			{#snippet children(entity)}
				{(entity.side ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>position</dt>
				<dd>
					<DydxChainPerpetualPositionView
						selection={select(EntityType.DydxChainPerpetualPosition, selection.entitySelector.$position)}
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
