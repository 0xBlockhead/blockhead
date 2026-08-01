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
	}: Omit<EntitySelectionViewProps<EntityType.DydxChainOrder>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.DydxIndexer,
			Source.KingnodesDydxNode,
		],
	}))
	const dydxChainOrder = $derived(viewSelection({
		fields: {
			side: true,
			orderType: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.orderId || 'dydx chain order')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import DydxChainOrder_TimestampsView from '$/views/DydxChainOrder_TimestampsView.svelte'
	import DydxChainSubaccountView from '$/views/DydxChainSubaccountView.svelte'
	import DydxChainMarketView from '$/views/DydxChainMarketView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainOrder}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={dydxChainOrder}>
			{#snippet children(entity)}
				{(entity.side ?? '') || selection.entitySelector.orderId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={dydxChainOrder}>
			{#snippet children(entity)}
				{@const orderType = entity.orderType}
				{#if orderType != null}
					<span data-text="muted">
						{orderType}
					</span>
				{/if}
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
				<dt>order ID</dt>
				<dd>
					{selection.entitySelector.orderId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$market}
			>
				{#snippet children(dydxChainMarket)}
					{#if dydxChainMarket != null}
						<div>
							<dt>market</dt>
							<dd>
								<DydxChainMarketView
									selection={select(EntityType.DydxChainMarket, dydxChainMarket[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={dydxChainOrder}
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
				resource={dydxChainOrder}
			>
				{#snippet children(entity)}
					{@const orderType = entity.orderType}
					{#if orderType != null}
						<div>
							<dt>order type</dt>
							<dd>
								{orderType}
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
							timeInForce: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timeInForce = entity.timeInForce}
					{#if timeInForce != null}
						<div>
							<dt>time in force</dt>
							<dd>
								{timeInForce}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							clientId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const clientId = entity.clientId}
					{#if clientId != null}
						<div>
							<dt>client ID</dt>
							<dd>
								{clientId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							goodTilBlock: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const goodTilBlock = entity.goodTilBlock}
					{#if goodTilBlock != null}
						<div>
							<dt>good til block</dt>
							<dd>
								{goodTilBlock}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							goodTilBlockTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const goodTilBlockTimeMs = entity.goodTilBlockTimeMs}
					{#if goodTilBlockTimeMs != null}
						<div>
							<dt>good til block time ms</dt>
							<dd>
								<Timestamp timestamp={goodTilBlockTimeMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<DydxChainOrder_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
