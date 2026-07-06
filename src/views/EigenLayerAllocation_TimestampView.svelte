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
			selection: EntityProxyResource<typeof schema, EntityType.EigenLayerAllocation_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EigenLayerAllocation_Timestamp>>
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
		sources: [
			Source.EigenExplorer_Rest,
			Source.EigenLayerContracts_Evm,
			Source.EigenLayerSubgraph_Graphql,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
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
		<ResourceBoundary resource={eigenLayerAllocationTimestamp}>
			{#snippet Pending()}
				<EigenLayerOperatorView
					selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<EigenLayerOperatorView
					selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={eigenLayerAllocationTimestamp}>
			{#snippet Pending()}
				<EigenLayerAvsView
					selection={select(EntityType.EigenLayerAvs, selection.entitySelector.$avs)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<EigenLayerAvsView
					selection={select(EntityType.EigenLayerAvs, selection.entitySelector.$avs)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eigenLayerAllocationTimestamp}>
			{#snippet Pending()}
				<span data-text="muted">
					<EigenLayerStrategyView
						selection={select(EntityType.EigenLayerStrategy, selection.entitySelector.$strategy)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>operator</dt>
				<dd>
					<EigenLayerOperatorView
						selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>AVS</dt>
				<dd>
					<EigenLayerAvsView
						selection={select(EntityType.EigenLayerAvs, selection.entitySelector.$avs)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>strategy</dt>
				<dd>
					<EigenLayerStrategyView
						selection={select(EntityType.EigenLayerStrategy, selection.entitySelector.$strategy)}
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
							allocationMagnitude: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const allocationMagnitude = prefetched.allocationMagnitude}
					{#if allocationMagnitude !== undefined && allocationMagnitude !== null}
						<div>
							<dt>allocation magnitude</dt>
							<dd>
								<NumberValue value={Number(allocationMagnitude)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const allocationMagnitude = resolvedEntity.allocationMagnitude}
					{#if allocationMagnitude !== undefined && allocationMagnitude !== null}
						<div>
							<dt>allocation magnitude</dt>
							<dd>
								<NumberValue value={Number(allocationMagnitude)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							allocatedShares: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const allocatedShares = prefetched.allocatedShares}
					{#if allocatedShares !== undefined && allocatedShares !== null}
						<div>
							<dt>allocated shares</dt>
							<dd>
								<NumberValue value={Number(allocatedShares)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const allocatedShares = resolvedEntity.allocatedShares}
					{#if allocatedShares !== undefined && allocatedShares !== null}
						<div>
							<dt>allocated shares</dt>
							<dd>
								<NumberValue value={Number(allocatedShares)} />
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
								fields: {
									quorumNumbers: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const quorumNumbers = prefetched.quorumNumbers}
							{#if quorumNumbers !== undefined && quorumNumbers !== null}
								{(quorumNumbers?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const quorumNumbers = resolvedEntity.quorumNumbers}
							{#if quorumNumbers !== undefined && quorumNumbers !== null}
								{(quorumNumbers?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							registrationStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const registrationStatus = prefetched.registrationStatus}
					{#if registrationStatus !== undefined && registrationStatus !== null}
						<div>
							<dt>registration status</dt>
							<dd>
								{String((registrationStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							slashableUntilMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const slashableUntilMs = prefetched.slashableUntilMs}
					{#if slashableUntilMs !== undefined && slashableUntilMs !== null}
						<div>
							<dt>slashable until ms</dt>
							<dd>
								<Timestamp timestamp={Number(slashableUntilMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							operatorSetId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const operatorSetId = prefetched.operatorSetId}
					{#if operatorSetId !== undefined && operatorSetId !== null}
						<div>
							<dt>operator set ID</dt>
							<dd>
								{String((operatorSetId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
