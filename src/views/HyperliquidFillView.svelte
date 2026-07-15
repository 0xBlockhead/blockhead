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
	const hyperliquidFill = $derived(selection({}))
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
		<ResourceBoundary resource={hyperliquidFill}>
			{#snippet Pending()}
				{title || 'hyperliquid fill'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
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
								fields: {
									tid: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const tid = pendingEntity.tid}
							{#if tid !== undefined && tid !== null}
								{String((tid) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									oid: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const oid = pendingEntity.oid}
							{#if oid !== undefined && oid !== null}
								{String((oid) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									coin: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const coin = pendingEntity.coin}
							{#if coin !== undefined && coin !== null}
								{String((coin) ?? '')}
							{/if}
						{/snippet}

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
							direction: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const direction = pendingEntity.direction}
					{#if direction !== undefined && direction !== null}
						<div>
							<dt>direction</dt>
							<dd>
								{String((direction) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							price: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const price = pendingEntity.price}
					{#if price !== undefined && price !== null}
						<div>
							<dt>price</dt>
							<dd>
								{String((price) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							size: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const size = pendingEntity.size}
					{#if size !== undefined && size !== null}
						<div>
							<dt>size</dt>
							<dd>
								{String((size) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							startPosition: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const startPosition = pendingEntity.startPosition}
					{#if startPosition !== undefined && startPosition !== null}
						<div>
							<dt>start position</dt>
							<dd>
								{String((startPosition) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							closedPnl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const closedPnl = pendingEntity.closedPnl}
					{#if closedPnl !== undefined && closedPnl !== null}
						<div>
							<dt>closed pnl</dt>
							<dd>
								{String((closedPnl) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							fee: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fee = pendingEntity.fee}
					{#if fee !== undefined && fee !== null}
						<div>
							<dt>fee</dt>
							<dd>
								{String((fee) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							feeToken: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeToken = pendingEntity.feeToken}
					{#if feeToken !== undefined && feeToken !== null}
						<div>
							<dt>fee token</dt>
							<dd>
								{String((feeToken) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							timeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timeMs = pendingEntity.timeMs}
					{#if timeMs !== undefined && timeMs !== null}
						<div>
							<dt>time ms</dt>
							<dd>
								{String((timeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							hash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const hash = pendingEntity.hash}
					{#if hash !== undefined && hash !== null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={String((hash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							crossed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const crossed = pendingEntity.crossed}
					{#if crossed !== undefined && crossed !== null}
						<div>
							<dt>crossed</dt>
							<dd>
								{String((crossed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
				{#snippet Pending()}{/snippet}

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
				{#snippet Pending()}{/snippet}

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
