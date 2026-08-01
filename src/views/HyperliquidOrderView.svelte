<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HyperliquidOrder> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidOrder}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<HyperliquidAccountView
						selection={select(EntityType.HyperliquidAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
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
						{#snippet children(entity)}
							{entity.oid}
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
				{#snippet children(entity)}
					{@const cloid = entity.cloid}
					{#if cloid != null}
						<div>
							<dt>cloid</dt>
							<dd>
								{cloid}
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
						{#snippet children(entity)}
							{entity.coin}
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
					selection({
						fields: {
							orderType: true,
						},
					})
				}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							limitPrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const limitPrice = entity.limitPrice}
					{#if limitPrice != null}
						<div>
							<dt>limit price</dt>
							<dd>
								{limitPrice}
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
				{#snippet children(entity)}
					{@const originalSize = entity.originalSize}
					{#if originalSize != null}
						<div>
							<dt>original size</dt>
							<dd>
								{originalSize}
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
				{#snippet children(entity)}
					{@const triggerCondition = entity.triggerCondition}
					{#if triggerCondition != null}
						<div>
							<dt>trigger condition</dt>
							<dd>
								{triggerCondition}
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
				{#snippet children(entity)}
					{@const triggerPrice = entity.triggerPrice}
					{#if triggerPrice != null}
						<div>
							<dt>trigger price</dt>
							<dd>
								{triggerPrice}
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
				{#snippet children(entity)}
					{@const reduceOnly = entity.reduceOnly}
					{#if reduceOnly != null}
						<div>
							<dt>reduce only</dt>
							<dd>
								{reduceOnly}
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
				{#snippet children(entity)}
					{@const tif = entity.tif}
					{#if tif != null}
						<div>
							<dt>tif</dt>
							<dd>
								{tif}
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
				{#snippet children(entity)}
					{@const isTrigger = entity.isTrigger}
					{#if isTrigger != null}
						<div>
							<dt>is trigger</dt>
							<dd>
								{isTrigger}
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
				{#snippet children(entity)}
					{@const isPositionTpsl = entity.isPositionTpsl}
					{#if isPositionTpsl != null}
						<div>
							<dt>is position tpsl</dt>
							<dd>
								{isPositionTpsl}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
