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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalArweaveNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalArweaveNetwork_Timestamp>>
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
	const globalArweaveNetworkTimestamp = $derived(selection({
		sources: [
			Source.Arweave_Graphql,
			Source.Arweave_Rest,
			Source.Constants_Internal,
		],
		fields: {
			sourceReportedLatestHeight: true,
			reachable: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'global Arweave network timestamp')
	const viewDomId = $derived('-global-arweave-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GlobalArweaveNetworkView from '$/views/_GlobalArweaveNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalArweaveNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalArweaveNetworkTimestamp}>
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

	{#snippet Value()}
		<ResourceBoundary resource={globalArweaveNetworkTimestamp}>
			{#snippet Pending()}
				{@const sourceReportedLatestHeight0 = prefetched.sourceReportedLatestHeight}
				{#if sourceReportedLatestHeight0 !== undefined && sourceReportedLatestHeight0 !== null}
					<NumberValue value={Number(sourceReportedLatestHeight0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const sourceReportedLatestHeight0 = resolvedEntity.sourceReportedLatestHeight}
				{#if sourceReportedLatestHeight0 !== undefined && sourceReportedLatestHeight0 !== null}
					<NumberValue value={Number(sourceReportedLatestHeight0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={globalArweaveNetworkTimestamp}>
			{#snippet Pending()}
				{@const reachable0 = prefetched.reachable}
				{#if reachable0 !== undefined && reachable0 !== null}
					<span data-text="muted">
						{reachable0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const reachable0 = resolvedEntity.reachable}
				{#if reachable0 !== undefined && reachable0 !== null}
					<span data-text="muted">
						{reachable0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Hub</dt>
				<dd>
					<GlobalArweaveNetworkView
						selection={select(EntityType._GlobalArweaveNetwork, selection.entitySelector.$hub)}
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
							reachable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reachable = prefetched.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reachable = resolvedEntity.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							configuredAccessEndpointCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const configuredAccessEndpointCount = prefetched.configuredAccessEndpointCount}
					{#if configuredAccessEndpointCount !== undefined && configuredAccessEndpointCount !== null}
						<div>
							<dt>Configured access endpoints</dt>
							<dd>
								<NumberValue value={Number(configuredAccessEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const configuredAccessEndpointCount = resolvedEntity.configuredAccessEndpointCount}
					{#if configuredAccessEndpointCount !== undefined && configuredAccessEndpointCount !== null}
						<div>
							<dt>Configured access endpoints</dt>
							<dd>
								<NumberValue value={Number(configuredAccessEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reachableAccessEndpointCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reachableAccessEndpointCount = prefetched.reachableAccessEndpointCount}
					{#if reachableAccessEndpointCount !== undefined && reachableAccessEndpointCount !== null}
						<div>
							<dt>Reachable access endpoints</dt>
							<dd>
								<NumberValue value={Number(reachableAccessEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reachableAccessEndpointCount = resolvedEntity.reachableAccessEndpointCount}
					{#if reachableAccessEndpointCount !== undefined && reachableAccessEndpointCount !== null}
						<div>
							<dt>Reachable access endpoints</dt>
							<dd>
								<NumberValue value={Number(reachableAccessEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceReportedLatestHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceReportedLatestHeight = prefetched.sourceReportedLatestHeight}
					{#if sourceReportedLatestHeight !== undefined && sourceReportedLatestHeight !== null}
						<div>
							<dt>Source-reported latest height</dt>
							<dd>
								<NumberValue value={Number(sourceReportedLatestHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceReportedLatestHeight = resolvedEntity.sourceReportedLatestHeight}
					{#if sourceReportedLatestHeight !== undefined && sourceReportedLatestHeight !== null}
						<div>
							<dt>Source-reported latest height</dt>
							<dd>
								<NumberValue value={Number(sourceReportedLatestHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceWindowBlockCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowBlockCount = prefetched.sourceWindowBlockCount}
					{#if sourceWindowBlockCount !== undefined && sourceWindowBlockCount !== null}
						<div>
							<dt>Source-window blocks</dt>
							<dd>
								<NumberValue value={Number(sourceWindowBlockCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowBlockCount = resolvedEntity.sourceWindowBlockCount}
					{#if sourceWindowBlockCount !== undefined && sourceWindowBlockCount !== null}
						<div>
							<dt>Source-window blocks</dt>
							<dd>
								<NumberValue value={Number(sourceWindowBlockCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceWindowTransactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowTransactionCount = prefetched.sourceWindowTransactionCount}
					{#if sourceWindowTransactionCount !== undefined && sourceWindowTransactionCount !== null}
						<div>
							<dt>Source-window transactions</dt>
							<dd>
								<NumberValue value={Number(sourceWindowTransactionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowTransactionCount = resolvedEntity.sourceWindowTransactionCount}
					{#if sourceWindowTransactionCount !== undefined && sourceWindowTransactionCount !== null}
						<div>
							<dt>Source-window transactions</dt>
							<dd>
								<NumberValue value={Number(sourceWindowTransactionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							localCatalogExampleCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localCatalogExampleCount = prefetched.localCatalogExampleCount}
					{#if localCatalogExampleCount !== undefined && localCatalogExampleCount !== null}
						<div>
							<dt>Local catalog examples</dt>
							<dd>
								<NumberValue value={Number(localCatalogExampleCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localCatalogExampleCount = resolvedEntity.localCatalogExampleCount}
					{#if localCatalogExampleCount !== undefined && localCatalogExampleCount !== null}
						<div>
							<dt>Local catalog examples</dt>
							<dd>
								<NumberValue value={Number(localCatalogExampleCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
