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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalRssNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalRssNetwork_Timestamp>>
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
	const globalRssNetworkTimestamp = $derived(selection({
		sources: [
			Source.Rss_Rest,
			Source.Rss2Json_Rest,
		],
	}))
	const titleFallback = $derived('global RSS network timestamp')
	const viewDomId = $derived('-global-rss-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GlobalRssNetworkView from '$/views/_GlobalRssNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalRssNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalRssNetworkTimestamp}>
			{#snippet Pending()}
				<GlobalRssNetworkView
					selection={select(EntityType._GlobalRssNetwork, selection.entitySelector.$hub)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<GlobalRssNetworkView
					selection={select(EntityType._GlobalRssNetwork, selection.entitySelector.$hub)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalRssNetworkTimestamp}>
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>hub</dt>
				<dd>
					<GlobalRssNetworkView
						selection={select(EntityType._GlobalRssNetwork, selection.entitySelector.$hub)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
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
		</dl>

		<dl data-column-item="center">
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceWindowFeedCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowFeedCount = prefetched.sourceWindowFeedCount}
					{#if sourceWindowFeedCount !== undefined && sourceWindowFeedCount !== null}
						<div>
							<dt>source window feed count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowFeedCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowFeedCount = resolvedEntity.sourceWindowFeedCount}
					{#if sourceWindowFeedCount !== undefined && sourceWindowFeedCount !== null}
						<div>
							<dt>source window feed count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowFeedCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceWindowItemCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowItemCount = prefetched.sourceWindowItemCount}
					{#if sourceWindowItemCount !== undefined && sourceWindowItemCount !== null}
						<div>
							<dt>source window item count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowItemCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowItemCount = resolvedEntity.sourceWindowItemCount}
					{#if sourceWindowItemCount !== undefined && sourceWindowItemCount !== null}
						<div>
							<dt>source window item count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowItemCount)} />
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
							localCatalogFeedCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localCatalogFeedCount = prefetched.localCatalogFeedCount}
					{#if localCatalogFeedCount !== undefined && localCatalogFeedCount !== null}
						<div>
							<dt>local catalog feed count</dt>
							<dd>
								<NumberValue value={Number(localCatalogFeedCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localCatalogFeedCount = resolvedEntity.localCatalogFeedCount}
					{#if localCatalogFeedCount !== undefined && localCatalogFeedCount !== null}
						<div>
							<dt>local catalog feed count</dt>
							<dd>
								<NumberValue value={Number(localCatalogFeedCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							localCatalogItemCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localCatalogItemCount = prefetched.localCatalogItemCount}
					{#if localCatalogItemCount !== undefined && localCatalogItemCount !== null}
						<div>
							<dt>local catalog item count</dt>
							<dd>
								<NumberValue value={Number(localCatalogItemCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localCatalogItemCount = resolvedEntity.localCatalogItemCount}
					{#if localCatalogItemCount !== undefined && localCatalogItemCount !== null}
						<div>
							<dt>local catalog item count</dt>
							<dd>
								<NumberValue value={Number(localCatalogItemCount)} />
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
							reachable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reachable = prefetched.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>reachable</dt>
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
							<dt>reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fetchWindowKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fetchWindowKind = prefetched.fetchWindowKind}
					{#if fetchWindowKind !== undefined && fetchWindowKind !== null}
						<div>
							<dt>fetch window kind</dt>
							<dd>
								{String((fetchWindowKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fetchWindowKind = resolvedEntity.fetchWindowKind}
					{#if fetchWindowKind !== undefined && fetchWindowKind !== null}
						<div>
							<dt>fetch window kind</dt>
							<dd>
								{String((fetchWindowKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
