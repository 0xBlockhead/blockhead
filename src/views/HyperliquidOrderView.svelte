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
			selection: RegisteredEntityProxyResource<EntityType.HyperliquidOrder>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.HyperliquidOrder>>
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
	const hyperliquidOrder = $derived(selection({}))
	const titleFallback = $derived('hyperliquid order')
	const viewDomId = $derived('hyperliquid-order-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidOrder}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hyperliquidOrder}>
			{#snippet Pending()}
				{title || 'hyperliquid order'}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cloid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cloid = pendingEntity.cloid}
					{#if cloid !== undefined && cloid !== null}
						<div>
							<dt>cloid</dt>
							<dd>
								{String((cloid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cloid = resolvedEntity.cloid}
					{#if cloid !== undefined && cloid !== null}
						<div>
							<dt>cloid</dt>
							<dd>
								{String((cloid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							limitPrice: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const limitPrice = pendingEntity.limitPrice}
					{#if limitPrice !== undefined && limitPrice !== null}
						<div>
							<dt>limit price</dt>
							<dd>
								{String((limitPrice) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const limitPrice = resolvedEntity.limitPrice}
					{#if limitPrice !== undefined && limitPrice !== null}
						<div>
							<dt>limit price</dt>
							<dd>
								{String((limitPrice) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							originalSize: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const originalSize = pendingEntity.originalSize}
					{#if originalSize !== undefined && originalSize !== null}
						<div>
							<dt>original size</dt>
							<dd>
								{String((originalSize) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const originalSize = resolvedEntity.originalSize}
					{#if originalSize !== undefined && originalSize !== null}
						<div>
							<dt>original size</dt>
							<dd>
								{String((originalSize) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							triggerCondition: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const triggerCondition = pendingEntity.triggerCondition}
					{#if triggerCondition !== undefined && triggerCondition !== null}
						<div>
							<dt>trigger condition</dt>
							<dd>
								{String((triggerCondition) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const triggerCondition = resolvedEntity.triggerCondition}
					{#if triggerCondition !== undefined && triggerCondition !== null}
						<div>
							<dt>trigger condition</dt>
							<dd>
								{String((triggerCondition) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							triggerPrice: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const triggerPrice = pendingEntity.triggerPrice}
					{#if triggerPrice !== undefined && triggerPrice !== null}
						<div>
							<dt>trigger price</dt>
							<dd>
								{String((triggerPrice) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const triggerPrice = resolvedEntity.triggerPrice}
					{#if triggerPrice !== undefined && triggerPrice !== null}
						<div>
							<dt>trigger price</dt>
							<dd>
								{String((triggerPrice) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reduceOnly: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reduceOnly = pendingEntity.reduceOnly}
					{#if reduceOnly !== undefined && reduceOnly !== null}
						<div>
							<dt>reduce only</dt>
							<dd>
								{String((reduceOnly) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reduceOnly = resolvedEntity.reduceOnly}
					{#if reduceOnly !== undefined && reduceOnly !== null}
						<div>
							<dt>reduce only</dt>
							<dd>
								{String((reduceOnly) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tif: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tif = pendingEntity.tif}
					{#if tif !== undefined && tif !== null}
						<div>
							<dt>tif</dt>
							<dd>
								{String((tif) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tif = resolvedEntity.tif}
					{#if tif !== undefined && tif !== null}
						<div>
							<dt>tif</dt>
							<dd>
								{String((tif) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isTrigger: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isTrigger = pendingEntity.isTrigger}
					{#if isTrigger !== undefined && isTrigger !== null}
						<div>
							<dt>is trigger</dt>
							<dd>
								{String((isTrigger) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isTrigger = resolvedEntity.isTrigger}
					{#if isTrigger !== undefined && isTrigger !== null}
						<div>
							<dt>is trigger</dt>
							<dd>
								{String((isTrigger) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isPositionTpsl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isPositionTpsl = pendingEntity.isPositionTpsl}
					{#if isPositionTpsl !== undefined && isPositionTpsl !== null}
						<div>
							<dt>is position tpsl</dt>
							<dd>
								{String((isPositionTpsl) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isPositionTpsl = resolvedEntity.isPositionTpsl}
					{#if isPositionTpsl !== undefined && isPositionTpsl !== null}
						<div>
							<dt>is position tpsl</dt>
							<dd>
								{String((isPositionTpsl) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
