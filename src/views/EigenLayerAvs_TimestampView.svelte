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
			selection: EntityProxyResource<typeof schema, EntityType.EigenLayerAvs_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EigenLayerAvs_Timestamp>>
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
	const eigenLayerAvsTimestamp = $derived(selection({
		sources: [
			Source.EigenExplorer_Rest,
			Source.EigenLayerContracts_Evm,
			Source.EigenLayerSubgraph_Graphql,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			operatorCount: true,
		},
	}))
	const titleFallback = $derived('eigen layer avs timestamp')
	const viewDomId = $derived('eigen-layer-avs-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EigenLayerAvsView from '$/views/EigenLayerAvsView.svelte'
</script>


<EntityView
	entityType={EntityType.EigenLayerAvs_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={eigenLayerAvsTimestamp}>
			{#snippet Pending()}
				<EigenLayerAvsView
					selection={select(EntityType.EigenLayerAvs, selection.entitySelector.$avs)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<EigenLayerAvsView
					selection={select(EntityType.EigenLayerAvs, selection.entitySelector.$avs)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={eigenLayerAvsTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eigenLayerAvsTimestamp}>
			{#snippet Pending()}
				{@const operatorCount0 = prefetched.operatorCount}
				{#if operatorCount0 !== undefined && operatorCount0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(operatorCount0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const operatorCount0 = resolvedEntity.operatorCount}
				{#if operatorCount0 !== undefined && operatorCount0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(operatorCount0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
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
							blockNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockNumber = prefetched.blockNumber}
					{#if blockNumber !== undefined && blockNumber !== null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue value={Number(blockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockNumber = resolvedEntity.blockNumber}
					{#if blockNumber !== undefined && blockNumber !== null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue value={Number(blockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							operatorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const operatorCount = prefetched.operatorCount}
					{#if operatorCount !== undefined && operatorCount !== null}
						<div>
							<dt>operator count</dt>
							<dd>
								<NumberValue value={Number(operatorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const operatorCount = resolvedEntity.operatorCount}
					{#if operatorCount !== undefined && operatorCount !== null}
						<div>
							<dt>operator count</dt>
							<dd>
								<NumberValue value={Number(operatorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							strategyCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const strategyCount = prefetched.strategyCount}
					{#if strategyCount !== undefined && strategyCount !== null}
						<div>
							<dt>strategy count</dt>
							<dd>
								<NumberValue value={Number(strategyCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const strategyCount = resolvedEntity.strategyCount}
					{#if strategyCount !== undefined && strategyCount !== null}
						<div>
							<dt>strategy count</dt>
							<dd>
								<NumberValue value={Number(strategyCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
		</dl>
	{/snippet}
</EntityView>
