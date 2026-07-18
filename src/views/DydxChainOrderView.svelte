<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.DydxChainOrder>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.DydxChainOrder>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const dydxChainOrder = $derived(selection({
		sources: selection.sources,
		fields: {
			side: true,
			orderType: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.orderId) ?? '')].filter(Boolean).join(' ') || 'dydx chain order')
	const viewDomId = $derived('dydx-chain-order-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import DydxChainOrder_TimestampsView from '$/views/DydxChainOrder_TimestampsView.svelte'
	import DydxChainSubaccountView from '$/views/DydxChainSubaccountView.svelte'
	import DydxChainMarketView from '$/views/DydxChainMarketView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainOrder}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.orderId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={dydxChainOrder}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.orderId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.side) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.orderId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={dydxChainOrder}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.side) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.orderId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const orderType0 = pendingEntity.orderType}
			{#if orderType0 !== undefined && orderType0 !== null}
				<span data-text="muted">
					{String((orderType0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={dydxChainOrder}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const orderType0 = resolvedEntity.orderType}
					{#if orderType0 !== undefined && orderType0 !== null}
						<span data-text="muted">
							{String((orderType0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>subaccount</dt>
				<dd>
					<DydxChainSubaccountView
						selection={select(EntityType.DydxChainSubaccount, selection.entitySelector.$subaccount, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>order ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									orderId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const orderId = resolvedEntity.orderId}
							{#if orderId !== undefined && orderId !== null}
								{String((orderId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$market}
			>
				{#snippet children(dydxChainMarket)}
					{#if dydxChainMarket != null && dydxChainMarket[EntityMetaKey.Selector] != null}
						<div>
							<dt>market</dt>
							<dd>
								<DydxChainMarketView
									selection={select(EntityType.DydxChainMarket, dydxChainMarket[EntityMetaKey.Selector])}
									prefetched={dydxChainMarket}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							side: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const side = resolvedEntity.side}
					{#if side !== undefined && side !== null}
						<div>
							<dt>side</dt>
							<dd>
								{String((side) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							orderType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const orderType = resolvedEntity.orderType}
					{#if orderType !== undefined && orderType !== null}
						<div>
							<dt>order type</dt>
							<dd>
								{String((orderType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							timeInForce: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timeInForce = resolvedEntity.timeInForce}
					{#if timeInForce !== undefined && timeInForce !== null}
						<div>
							<dt>time in force</dt>
							<dd>
								{String((timeInForce) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							clientId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const clientId = resolvedEntity.clientId}
					{#if clientId !== undefined && clientId !== null}
						<div>
							<dt>client ID</dt>
							<dd>
								{String((clientId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							goodTilBlock: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const goodTilBlock = resolvedEntity.goodTilBlock}
					{#if goodTilBlock !== undefined && goodTilBlock !== null}
						<div>
							<dt>good til block</dt>
							<dd>
								{String((goodTilBlock) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							goodTilBlockTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const goodTilBlockTimeMs = resolvedEntity.goodTilBlockTimeMs}
					{#if goodTilBlockTimeMs !== undefined && goodTilBlockTimeMs !== null}
						<div>
							<dt>good til block time ms</dt>
							<dd>
								<Timestamp timestamp={Number(goodTilBlockTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<DydxChainOrder_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No dYdX order observations.'
				id='DydxChainOrder_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
