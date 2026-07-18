<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadIntentOrder>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadIntentOrder>>
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
	const blockheadIntentOrder = $derived(selection({
		sources: selection.sources,
		fields: {
			source: true,
			orderId: true,
			providerProtocol: true,
			submittedAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.orderId) ?? '')].filter(Boolean).join(' ') || 'blockhead intent order')
	const viewDomId = $derived('blockhead-intent-order-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadIntentOrder_TimestampsView from '$/views/BlockheadIntentOrder_TimestampsView.svelte'
	import BlockheadIntentQuoteView from '$/views/BlockheadIntentQuoteView.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadIntentOrder}
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
			<ResourceBoundary resource={blockheadIntentOrder}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.orderId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.providerProtocol) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.orderId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadIntentOrder}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.providerProtocol) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.orderId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const submittedAt0 = pendingEntity.submittedAt}
			{#if submittedAt0 !== undefined && submittedAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(submittedAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadIntentOrder}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const submittedAt0 = resolvedEntity.submittedAt}
					{#if submittedAt0 !== undefined && submittedAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(submittedAt0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									id: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const id = resolvedEntity.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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
				resource={selection.$quote}
			>
				{#snippet children(blockheadIntentQuote)}
					{#if blockheadIntentQuote != null && blockheadIntentQuote[EntityMetaKey.Selector] != null}
						<div>
							<dt>quote</dt>
							<dd>
								<BlockheadIntentQuoteView
									selection={select(EntityType.BlockheadIntentQuote, blockheadIntentQuote[EntityMetaKey.Selector])}
									prefetched={blockheadIntentQuote}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$sessionAction}
			>
				{#snippet children(blockheadSessionAction)}
					{#if blockheadSessionAction != null && blockheadSessionAction[EntityMetaKey.Selector] != null}
						<div>
							<dt>session action</dt>
							<dd>
								<BlockheadSessionActionView
									selection={select(EntityType.BlockheadSessionAction, blockheadSessionAction[EntityMetaKey.Selector])}
									prefetched={blockheadSessionAction}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>provider protocol</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									providerProtocol: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const providerProtocol = resolvedEntity.providerProtocol}
							{#if providerProtocol !== undefined && providerProtocol !== null}
								{String((providerProtocol) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>submitted AT</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									submittedAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const submittedAt = resolvedEntity.submittedAt}
							{#if submittedAt !== undefined && submittedAt !== null}
								<Timestamp timestamp={Number(submittedAt)} />
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
							signatureHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signatureHash = resolvedEntity.signatureHash}
					{#if signatureHash !== undefined && signatureHash !== null}
						<div>
							<dt>signature hash</dt>
							<dd>
								<TruncatedValue value={String((signatureHash) ?? '')} />
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
							orderPayloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const orderPayloadHash = resolvedEntity.orderPayloadHash}
					{#if orderPayloadHash !== undefined && orderPayloadHash !== null}
						<div>
							<dt>order payload hash</dt>
							<dd>
								<TruncatedValue value={String((orderPayloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadIntentOrder_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No order observations.'
				id='BlockheadIntentOrder_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
