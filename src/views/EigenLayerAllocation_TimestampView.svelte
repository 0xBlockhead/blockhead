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
			selection: RegisteredEntityProxyResource<EntityType.EigenLayerAllocation_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EigenLayerAllocation_Timestamp>>
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
	const eigenLayerAllocationTimestamp = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('eigen layer allocation timestamp')
	const viewDomId = $derived('eigen-layer-allocation-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EigenLayerOperatorView from '$/views/EigenLayerOperatorView.svelte'
	import EigenLayerAvsView from '$/views/EigenLayerAvsView.svelte'
	import EigenLayerStrategyView from '$/views/EigenLayerStrategyView.svelte'
</script>


<EntityView
	entityType={EntityType.EigenLayerAllocation_Timestamp}
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
					<EigenLayerOperatorView
						selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator)}
						layout={EntityLayout.Title}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={eigenLayerAllocationTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<EigenLayerOperatorView
						selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator)}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<EigenLayerAvsView
						selection={select(EntityType.EigenLayerAvs, selection.entitySelector.$avs)}
						layout={EntityLayout.Value}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={eigenLayerAllocationTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<EigenLayerAvsView
						selection={select(EntityType.EigenLayerAvs, selection.entitySelector.$avs)}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			<span data-text="muted">
				<EigenLayerStrategyView
					selection={select(EntityType.EigenLayerStrategy, selection.entitySelector.$strategy)}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={eigenLayerAllocationTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<span data-text="muted">
						<EigenLayerStrategyView
							selection={select(EntityType.EigenLayerStrategy, selection.entitySelector.$strategy)}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>operator</dt>
				<dd>
					<EigenLayerOperatorView
						selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>AVS</dt>
				<dd>
					<EigenLayerAvsView
						selection={select(EntityType.EigenLayerAvs, selection.entitySelector.$avs, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>strategy</dt>
				<dd>
					<EigenLayerStrategyView
						selection={select(EntityType.EigenLayerStrategy, selection.entitySelector.$strategy, {})}
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
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							allocationMagnitude: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const allocationMagnitude = resolvedEntity.allocationMagnitude}
					{#if allocationMagnitude !== undefined && allocationMagnitude !== null}
						<div>
							<dt>allocation magnitude</dt>
							<dd>
								<NumberValue
									value={allocationMagnitude}
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
							allocatedShares: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const allocatedShares = resolvedEntity.allocatedShares}
					{#if allocatedShares !== undefined && allocatedShares !== null}
						<div>
							<dt>allocated shares</dt>
							<dd>
								<NumberValue
									value={allocatedShares}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>quorum numbers</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									quorumNumbers: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const quorumNumbers = resolvedEntity.quorumNumbers}
							{#if quorumNumbers !== undefined && quorumNumbers !== null}
								{quorumNumbers.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
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
							registrationStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const registrationStatus = resolvedEntity.registrationStatus}
					{#if registrationStatus !== undefined && registrationStatus !== null}
						<div>
							<dt>registration status</dt>
							<dd>
								{String((registrationStatus) ?? '')}
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
							slashableUntilMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const slashableUntilMs = resolvedEntity.slashableUntilMs}
					{#if slashableUntilMs !== undefined && slashableUntilMs !== null}
						<div>
							<dt>slashable until ms</dt>
							<dd>
								<Timestamp timestamp={Number(slashableUntilMs)} />
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
							operatorSetId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const operatorSetId = resolvedEntity.operatorSetId}
					{#if operatorSetId !== undefined && operatorSetId !== null}
						<div>
							<dt>operator set ID</dt>
							<dd>
								{String((operatorSetId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
