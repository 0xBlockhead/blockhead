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
							observedFeedCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedFeedCount = prefetched.observedFeedCount}
					{#if observedFeedCount !== undefined && observedFeedCount !== null}
						<div>
							<dt>observed feed count</dt>
							<dd>
								<NumberValue value={Number(observedFeedCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedFeedCount = resolvedEntity.observedFeedCount}
					{#if observedFeedCount !== undefined && observedFeedCount !== null}
						<div>
							<dt>observed feed count</dt>
							<dd>
								<NumberValue value={Number(observedFeedCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedItemCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedItemCount = prefetched.observedItemCount}
					{#if observedItemCount !== undefined && observedItemCount !== null}
						<div>
							<dt>observed item count</dt>
							<dd>
								<NumberValue value={Number(observedItemCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedItemCount = resolvedEntity.observedItemCount}
					{#if observedItemCount !== undefined && observedItemCount !== null}
						<div>
							<dt>observed item count</dt>
							<dd>
								<NumberValue value={Number(observedItemCount)} />
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
							seededFeedCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const seededFeedCount = prefetched.seededFeedCount}
					{#if seededFeedCount !== undefined && seededFeedCount !== null}
						<div>
							<dt>seeded feed count</dt>
							<dd>
								<NumberValue value={Number(seededFeedCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const seededFeedCount = resolvedEntity.seededFeedCount}
					{#if seededFeedCount !== undefined && seededFeedCount !== null}
						<div>
							<dt>seeded feed count</dt>
							<dd>
								<NumberValue value={Number(seededFeedCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							seededItemCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const seededItemCount = prefetched.seededItemCount}
					{#if seededItemCount !== undefined && seededItemCount !== null}
						<div>
							<dt>seeded item count</dt>
							<dd>
								<NumberValue value={Number(seededItemCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const seededItemCount = resolvedEntity.seededItemCount}
					{#if seededItemCount !== undefined && seededItemCount !== null}
						<div>
							<dt>seeded item count</dt>
							<dd>
								<NumberValue value={Number(seededItemCount)} />
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
