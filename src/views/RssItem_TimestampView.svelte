<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.RssItem_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.RssItem_Timestamp>>
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
	const rssItemTimestamp = $derived(selection({
		sources: [
			Source.Rss_Rest,
			Source.Rss2Json_Rest,
		],
	}))
	const titleFallback = $derived('RSS item observation')
	const viewDomId = $derived('rss-item-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$item !== undefined && pendingEntity.$item.itemIdentityKind !== undefined && pendingEntity.$item.itemIdentity !== undefined && pendingEntity.$item.$feed !== undefined && pendingEntity.$item.$feed.feedUrl !== undefined ? resolve('/rss/feed/[feedUrl=absoluteUrl]/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			itemIdentityKind: String(pendingEntity.$item.itemIdentityKind ?? ''),
			itemIdentity: String(pendingEntity.$item.itemIdentity ?? ''),
			feedUrl: String(pendingEntity.$item.$feed.feedUrl ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={rssItemTimestamp}>
			{#snippet Pending()}
				<RssItemView
					selection={select(EntityType.RssItem, selection.entitySelector.$item)}
					href={
						(selection.entitySelector.$item.itemIdentityKind !== undefined && selection.entitySelector.$item.itemIdentity !== undefined && selection.entitySelector.$item.$feed !== undefined && selection.entitySelector.$item.$feed.feedUrl !== undefined ? resolve('/rss/feed/[feedUrl=absoluteUrl]/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]', {
							itemIdentityKind: String(selection.entitySelector.$item.itemIdentityKind ?? ''),
							itemIdentity: String(selection.entitySelector.$item.itemIdentity ?? ''),
							feedUrl: String(selection.entitySelector.$item.$feed.feedUrl ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<RssItemView
					selection={select(EntityType.RssItem, selection.entitySelector.$item)}
					href={
						(selection.entitySelector.$item.itemIdentityKind !== undefined && selection.entitySelector.$item.itemIdentity !== undefined && selection.entitySelector.$item.$feed !== undefined && selection.entitySelector.$item.$feed.feedUrl !== undefined ? resolve('/rss/feed/[feedUrl=absoluteUrl]/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]', {
							itemIdentityKind: String(selection.entitySelector.$item.itemIdentityKind ?? ''),
							itemIdentity: String(selection.entitySelector.$item.itemIdentity ?? ''),
							feedUrl: String(selection.entitySelector.$item.$feed.feedUrl ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={rssItemTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
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
				<dt>Item</dt>
				<dd>
					<RssItemView
						selection={select(EntityType.RssItem, selection.entitySelector.$item, {})}
						href={
							(selection.entitySelector.$item.itemIdentityKind !== undefined && selection.entitySelector.$item.itemIdentity !== undefined && selection.entitySelector.$item.$feed !== undefined && selection.entitySelector.$item.$feed.feedUrl !== undefined ? resolve('/rss/feed/[feedUrl=absoluteUrl]/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]', {
								itemIdentityKind: String(selection.entitySelector.$item.itemIdentityKind ?? ''),
								itemIdentity: String(selection.entitySelector.$item.itemIdentity ?? ''),
								feedUrl: String(selection.entitySelector.$item.$feed.feedUrl ?? ''),
							}) : undefined)
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
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
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
							{@const source = pendingEntity.source}
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

			<div>
				<dt>Observed</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									observed: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const observed = pendingEntity.observed}
							{#if observed !== undefined && observed !== null}
								{observed ? 'Yes' : 'No'}
							{/if}
						{/snippet}

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
								fields: {
									reachable: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const reachable = pendingEntity.reachable}
							{#if reachable !== undefined && reachable !== null}
								{reachable ? 'Yes' : 'No'}
							{/if}
						{/snippet}

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
								fields: {
									fetchWindowKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const fetchWindowKind = pendingEntity.fetchWindowKind}
							{#if fetchWindowKind !== undefined && fetchWindowKind !== null}
								{String((fetchWindowKind) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const error = pendingEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>Error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
