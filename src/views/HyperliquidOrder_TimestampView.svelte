<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidOrder_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HyperliquidOrder_Timestamp>>
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
	const hyperliquidOrderTimestamp = $derived(selection({}))
	const titleFallback = $derived('hyperliquid order timestamp')
	const viewDomId = $derived('hyperliquid-order-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HyperliquidOrderView from '$/views/HyperliquidOrderView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidOrder_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hyperliquidOrderTimestamp}>
			{#snippet Pending()}
				{title || 'hyperliquid order timestamp'}
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
				<dt>order</dt>
				<dd>
					<HyperliquidOrderView
						selection={select(EntityType.HyperliquidOrder, selection.entitySelector.$order, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = prefetched.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							statusTimestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const statusTimestampMs = prefetched.statusTimestampMs}
					{#if statusTimestampMs !== undefined && statusTimestampMs !== null}
						<div>
							<dt>status timestamp ms</dt>
							<dd>
								<Timestamp timestamp={Number(statusTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const statusTimestampMs = resolvedEntity.statusTimestampMs}
					{#if statusTimestampMs !== undefined && statusTimestampMs !== null}
						<div>
							<dt>status timestamp ms</dt>
							<dd>
								<Timestamp timestamp={Number(statusTimestampMs)} />
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
					{@const size = prefetched.size}
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
							filledSize: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const filledSize = prefetched.filledSize}
					{#if filledSize !== undefined && filledSize !== null}
						<div>
							<dt>filled size</dt>
							<dd>
								{String((filledSize) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const filledSize = resolvedEntity.filledSize}
					{#if filledSize !== undefined && filledSize !== null}
						<div>
							<dt>filled size</dt>
							<dd>
								{String((filledSize) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							remainingSize: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const remainingSize = prefetched.remainingSize}
					{#if remainingSize !== undefined && remainingSize !== null}
						<div>
							<dt>remaining size</dt>
							<dd>
								{String((remainingSize) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const remainingSize = resolvedEntity.remainingSize}
					{#if remainingSize !== undefined && remainingSize !== null}
						<div>
							<dt>remaining size</dt>
							<dd>
								{String((remainingSize) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastFillTid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastFillTid = prefetched.lastFillTid}
					{#if lastFillTid !== undefined && lastFillTid !== null}
						<div>
							<dt>last fill tid</dt>
							<dd>
								{String((lastFillTid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastFillTid = resolvedEntity.lastFillTid}
					{#if lastFillTid !== undefined && lastFillTid !== null}
						<div>
							<dt>last fill tid</dt>
							<dd>
								{String((lastFillTid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
