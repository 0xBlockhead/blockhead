<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.RssItem_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.RssItem_Timestamp>
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
	const rssItemTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'RSS item observation'
	const viewDomId = $derived('rss-item-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import RssItemView from '$/views/RssItemView.svelte'
</script>


<EntityView
	entityType={EntityType.RssItem_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'timestampMs' in selection.entitySelector
			&& selection.entitySelector.timestampMs != null
			&& selection.entitySelector != null && 'source' in selection.entitySelector
			&& selection.entitySelector.source != null
			&& selection.entitySelector != null && '$item' in selection.entitySelector
			&& selection.entitySelector.$item != null && 'itemIdentityKind' in selection.entitySelector.$item
			&& selection.entitySelector.$item.itemIdentityKind != null
			&& selection.entitySelector.$item != null && 'itemIdentity' in selection.entitySelector.$item
			&& selection.entitySelector.$item.itemIdentity != null
			&& selection.entitySelector.$item != null && '$feed' in selection.entitySelector.$item
			&& selection.entitySelector.$item.$feed != null && 'feedUrl' in selection.entitySelector.$item.$feed
			&& selection.entitySelector.$item.$feed.feedUrl != null ?
				resolve('/rss/feed/[feedUrl=absoluteUrl]/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(selection.entitySelector.timestampMs ?? ''),
			source: String(selection.entitySelector.source ?? ''),
			itemIdentityKind: String(selection.entitySelector.$item.itemIdentityKind ?? ''),
			itemIdentity: encodeURIComponent(String(selection.entitySelector.$item.itemIdentity ?? '')),
			feedUrl: encodeURIComponent(String(selection.entitySelector.$item.$feed.feedUrl ?? '')),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$item') && prefetched.$item != null && Object.hasOwn(prefetched.$item, 'title') && Object.hasOwn(prefetched.$item, 'publishedAt')}
			{@const rssItem0 = pendingEntity.$item}
			{#if rssItem0 != null && selection.entitySelector.$item != null}
				<RssItemView
					selection={select(EntityType.RssItem, selection.entitySelector.$item, { sources: selection.sources })}
					prefetched={rssItem0}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={rssItemTimestamp}>
				{#snippet children(entity)}
					<RssItemView
						selection={select(EntityType.RssItem, selection.entitySelector.$item)}
						href=""
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$item') && prefetched.$item != null && Object.hasOwn(prefetched.$item, 'title') && Object.hasOwn(prefetched.$item, 'publishedAt')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={rssItemTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Item</dt>
				<dd>
					<RssItemView
						selection={select(EntityType.RssItem, selection.entitySelector.$item)}
						href={
							(
								selection.entitySelector.$item != null && 'itemIdentityKind' in selection.entitySelector.$item
								&& selection.entitySelector.$item.itemIdentityKind != null
								&& selection.entitySelector.$item != null && 'itemIdentity' in selection.entitySelector.$item
								&& selection.entitySelector.$item.itemIdentity != null
								&& selection.entitySelector.$item != null && '$feed' in selection.entitySelector.$item
								&& selection.entitySelector.$item.$feed != null && 'feedUrl' in selection.entitySelector.$item.$feed
								&& selection.entitySelector.$item.$feed.feedUrl != null ?
									resolve('/rss/feed/[feedUrl=absoluteUrl]/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]', {
								itemIdentityKind: String(selection.entitySelector.$item.itemIdentityKind ?? ''),
								itemIdentity: encodeURIComponent(String(selection.entitySelector.$item.itemIdentity ?? '')),
								feedUrl: encodeURIComponent(String(selection.entitySelector.$item.$feed.feedUrl ?? '')),
							})
							:
									undefined
							)
						}
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
		</dl>

		<dl data-column-item="center">
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
				<dt>Observed</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									observed: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const observed = resolvedEntity.observed}
							{#if observed !== undefined && observed !== null}
								{observed ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Feed reachable</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									reachable: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const reachable = resolvedEntity.reachable}
							{#if reachable !== undefined && reachable !== null}
								{reachable ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Fetch window</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									fetchWindowKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const fetchWindowKind = resolvedEntity.fetchWindowKind}
							{#if fetchWindowKind !== undefined && fetchWindowKind !== null}
								{String((fetchWindowKind) ?? '')}
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
						sources: selection.sources,
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>Error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
