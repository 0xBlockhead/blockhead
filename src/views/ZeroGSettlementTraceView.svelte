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
			selection: RegisteredEntityProxyResource<EntityType.ZeroGSettlementTrace>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.ZeroGSettlementTrace>>
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
	const zeroGSettlementTrace = $derived(selection({
		sources: selection.sources,
		fields: {
			settlementTransactionHash: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.traceId) ?? '')].filter(Boolean).join(' ') || 'zero g settlement trace')
	const viewDomId = $derived('zero-gsettlement-trace-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ZeroGServiceRequestView from '$/views/ZeroGServiceRequestView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGSettlementTrace}
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
			{[String((pendingEntity.traceId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={zeroGSettlementTrace}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.traceId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ZeroGServiceRequestView
						selection={select(EntityType.ZeroGServiceRequest, selection.entitySelector.$serviceRequest)}
						layout={EntityLayout.Value}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={zeroGSettlementTrace}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ZeroGServiceRequestView
						selection={select(EntityType.ZeroGServiceRequest, selection.entitySelector.$serviceRequest)}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const settlementTransactionHash0 = pendingEntity.settlementTransactionHash}
			{#if settlementTransactionHash0 !== undefined && settlementTransactionHash0 !== null}
				<span data-text="muted">
					<TruncatedValue value={String((settlementTransactionHash0) ?? '')} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={zeroGSettlementTrace}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const settlementTransactionHash0 = resolvedEntity.settlementTransactionHash}
					{#if settlementTransactionHash0 !== undefined && settlementTransactionHash0 !== null}
						<span data-text="muted">
							<TruncatedValue value={String((settlementTransactionHash0) ?? '')} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>service request</dt>
				<dd>
					<ZeroGServiceRequestView
						selection={select(EntityType.ZeroGServiceRequest, selection.entitySelector.$serviceRequest, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>trace ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									traceId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const traceId = resolvedEntity.traceId}
							{#if traceId !== undefined && traceId !== null}
								{String((traceId) ?? '')}
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
							settlementTransactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const settlementTransactionHash = resolvedEntity.settlementTransactionHash}
					{#if settlementTransactionHash !== undefined && settlementTransactionHash !== null}
						<div>
							<dt>settlement transaction hash</dt>
							<dd>
								<TruncatedValue value={String((settlementTransactionHash) ?? '')} />
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
							acknowledgementSignature: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const acknowledgementSignature = resolvedEntity.acknowledgementSignature}
					{#if acknowledgementSignature !== undefined && acknowledgementSignature !== null}
						<div>
							<dt>acknowledgement signature</dt>
							<dd>
								<TruncatedValue value={String((acknowledgementSignature) ?? '')} />
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
							rewardAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rewardAmount = resolvedEntity.rewardAmount}
					{#if rewardAmount !== undefined && rewardAmount !== null}
						<div>
							<dt>reward amount</dt>
							<dd>
								<NumberValue
									value={rewardAmount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
