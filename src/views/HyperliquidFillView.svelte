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
			selection: RegisteredEntityProxyResource<EntityType.HyperliquidFill>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.HyperliquidFill>>
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
	const hyperliquidFill = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('hyperliquid fill')
	const viewDomId = $derived('hyperliquid-fill-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
	import HyperliquidOrderView from '$/views/HyperliquidOrderView.svelte'
	import HyperliquidTransactionView from '$/views/HyperliquidTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidFill}
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
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={hyperliquidFill}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<HyperliquidAccountView
						selection={select(EntityType.HyperliquidAccount, selection.entitySelector.$account, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>tid</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									tid: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const tid = resolvedEntity.tid}
							{#if tid !== undefined && tid !== null}
								{String((tid) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>oid</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									oid: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const oid = resolvedEntity.oid}
							{#if oid !== undefined && oid !== null}
								{String((oid) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>coin</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									coin: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const coin = resolvedEntity.coin}
							{#if coin !== undefined && coin !== null}
								{String((coin) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
							direction: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const direction = resolvedEntity.direction}
					{#if direction !== undefined && direction !== null}
						<div>
							<dt>direction</dt>
							<dd>
								{String((direction) ?? '')}
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
							price: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const price = resolvedEntity.price}
					{#if price !== undefined && price !== null}
						<div>
							<dt>price</dt>
							<dd>
								{String((price) ?? '')}
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
							size: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const size = resolvedEntity.size}
					{#if size !== undefined && size !== null}
						<div>
							<dt>size</dt>
							<dd>
								{String((size) ?? '')}
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
							startPosition: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const startPosition = resolvedEntity.startPosition}
					{#if startPosition !== undefined && startPosition !== null}
						<div>
							<dt>start position</dt>
							<dd>
								{String((startPosition) ?? '')}
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
							closedPnl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const closedPnl = resolvedEntity.closedPnl}
					{#if closedPnl !== undefined && closedPnl !== null}
						<div>
							<dt>closed pnl</dt>
							<dd>
								{String((closedPnl) ?? '')}
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
							fee: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fee = resolvedEntity.fee}
					{#if fee !== undefined && fee !== null}
						<div>
							<dt>fee</dt>
							<dd>
								{String((fee) ?? '')}
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
							feeToken: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeToken = resolvedEntity.feeToken}
					{#if feeToken !== undefined && feeToken !== null}
						<div>
							<dt>fee token</dt>
							<dd>
								{String((feeToken) ?? '')}
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
							timeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timeMs = resolvedEntity.timeMs}
					{#if timeMs !== undefined && timeMs !== null}
						<div>
							<dt>time ms</dt>
							<dd>
								{String((timeMs) ?? '')}
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
							hash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hash = resolvedEntity.hash}
					{#if hash !== undefined && hash !== null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={String((hash) ?? '')} />
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
							crossed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const crossed = resolvedEntity.crossed}
					{#if crossed !== undefined && crossed !== null}
						<div>
							<dt>crossed</dt>
							<dd>
								{String((crossed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$order}
			>
				{#snippet children(hyperliquidOrder)}
					{#if hyperliquidOrder != null && hyperliquidOrder[EntityMetaKey.Selector] != null}
						<div>
							<dt>order</dt>
							<dd>
								<HyperliquidOrderView
									selection={select(EntityType.HyperliquidOrder, hyperliquidOrder[EntityMetaKey.Selector])}
									prefetched={hyperliquidOrder}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$transaction}
			>
				{#snippet children(hyperliquidTransaction)}
					{#if hyperliquidTransaction != null && hyperliquidTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>transaction</dt>
							<dd>
								<HyperliquidTransactionView
									selection={select(EntityType.HyperliquidTransaction, hyperliquidTransaction[EntityMetaKey.Selector])}
									prefetched={hyperliquidTransaction}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
