<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
		sources: [
			Source.DydxIndexer_Rest,
			Source.DydxValidator_Rest,
		],
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
		<ResourceBoundary resource={dydxChainOrder}>
			{#snippet Pending()}
				{[String((pendingEntity.orderId) ?? '')].filter(Boolean).join(' ') || title || 'dydx chain order'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.orderId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={dydxChainOrder}>
			{#snippet Pending()}
				{[String((pendingEntity.side) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.orderId) ?? '')].filter(Boolean).join(' ') || title || 'dydx chain order'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.side) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.orderId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={dydxChainOrder}>
			{#snippet Pending()}
				{@const orderType0 = pendingEntity.orderType}
				{#if orderType0 !== undefined && orderType0 !== null}
					<span data-text="muted">
						{String((orderType0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
								fields: {
									orderId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const orderId = pendingEntity.orderId}
							{#if orderId !== undefined && orderId !== null}
								{String((orderId) ?? '')}
							{/if}
						{/snippet}

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
				{#snippet Pending()}{/snippet}

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
						fields: {
							side: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const side = pendingEntity.side}
					{#if side !== undefined && side !== null}
						<div>
							<dt>side</dt>
							<dd>
								{String((side) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							orderType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const orderType = pendingEntity.orderType}
					{#if orderType !== undefined && orderType !== null}
						<div>
							<dt>order type</dt>
							<dd>
								{String((orderType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							timeInForce: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timeInForce = pendingEntity.timeInForce}
					{#if timeInForce !== undefined && timeInForce !== null}
						<div>
							<dt>time in force</dt>
							<dd>
								{String((timeInForce) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							clientId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const clientId = pendingEntity.clientId}
					{#if clientId !== undefined && clientId !== null}
						<div>
							<dt>client ID</dt>
							<dd>
								{String((clientId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							goodTilBlock: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const goodTilBlock = pendingEntity.goodTilBlock}
					{#if goodTilBlock !== undefined && goodTilBlock !== null}
						<div>
							<dt>good til block</dt>
							<dd>
								{String((goodTilBlock) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							goodTilBlockTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const goodTilBlockTimeMs = pendingEntity.goodTilBlockTimeMs}
					{#if goodTilBlockTimeMs !== undefined && goodTilBlockTimeMs !== null}
						<div>
							<dt>good til block time ms</dt>
							<dd>
								<Timestamp timestamp={Number(goodTilBlockTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
