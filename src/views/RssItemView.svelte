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
	import { UrlString } from '$/schema/UrlString.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.RssItem>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.RssItem>>
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
	const rssItem = $derived(selection({
		sources: selection.sources,
		fields: {
			title: true,
			link: true,
			publishedAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.title) ?? ''), String((pendingEntity.itemIdentity) ?? '')].filter(Boolean).join(' ') || 'RSS item')
	const viewDomId = $derived('rss-item-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RssItem_TimestampsView from '$/views/RssItem_TimestampsView.svelte'
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


<EntityView
	entityType={EntityType.RssItem}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.itemIdentityKind !== undefined && pendingEntity.itemIdentity !== undefined && pendingEntity.$feed !== undefined && pendingEntity.$feed.feedUrl !== undefined ? resolve('/rss/feed/[feedUrl=absoluteUrl]/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]', {
			itemIdentityKind: String(pendingEntity.itemIdentityKind ?? ''),
			itemIdentity: encodeURIComponent(String(pendingEntity.itemIdentity ?? '')),
			feedUrl: encodeURIComponent(String(pendingEntity.$feed.feedUrl ?? '')),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.title) ?? ''), String((pendingEntity.itemIdentity) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={rssItem}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.title) ?? ''), String((resolvedEntity.itemIdentity) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const itemIdentity0 = pendingEntity.itemIdentity}
					{#if itemIdentity0 !== undefined && itemIdentity0 !== null}
						<TruncatedValue value={String((itemIdentity0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={rssItem}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const itemIdentity0 = resolvedEntity.itemIdentity}
					{#if itemIdentity0 !== undefined && itemIdentity0 !== null}
						<TruncatedValue value={String((itemIdentity0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const publishedAt0 = pendingEntity.publishedAt}
			{#if publishedAt0 !== undefined && publishedAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(publishedAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={rssItem}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const publishedAt0 = resolvedEntity.publishedAt}
					{#if publishedAt0 !== undefined && publishedAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(publishedAt0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Feed</dt>
				<dd>
					<RssFeedView
						selection={select(EntityType.RssFeed, selection.entitySelector.$feed, {})}
						href={
							(selection.entitySelector.$feed.feedUrl !== undefined ? resolve('/rss/feed/[feedUrl=absoluteUrl]', {
								feedUrl: encodeURIComponent(String(selection.entitySelector.$feed.feedUrl ?? '')),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							author: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const author = resolvedEntity.author}
					{#if author !== undefined && author !== null}
						<div>
							<dt>Author</dt>
							<dd>
								{String((author) ?? '')}
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
						sources: selection.sources,
						fields: {
							link: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const link = resolvedEntity.link}
					{#if link !== undefined && link !== null}
						<div>
							<dt>Link</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(link)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(link)} />
								</svelte:element>
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
						sources: selection.sources,
						fields: {
							publishedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const publishedAt = resolvedEntity.publishedAt}
					{#if publishedAt !== undefined && publishedAt !== null}
						<div>
							<dt>Published</dt>
							<dd>
								<Timestamp timestamp={Number(publishedAt)} />
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
						sources: selection.sources,
						fields: {
							updatedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updatedAt = resolvedEntity.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
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
						sources: selection.sources,
						fields: {
							enclosureUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const enclosureUrl = resolvedEntity.enclosureUrl}
					{#if enclosureUrl !== undefined && enclosureUrl !== null}
						<div>
							<dt>Enclosure URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(enclosureUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(enclosureUrl)} />
								</svelte:element>
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
						sources: selection.sources,
						fields: {
							commentsUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const commentsUrl = resolvedEntity.commentsUrl}
					{#if commentsUrl !== undefined && commentsUrl !== null}
						<div>
							<dt>Comments URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(commentsUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(commentsUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources,
					fields: {
						content: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const content = resolvedEntity.content}
				{#if content !== undefined && content !== null && content !== ''}
					<p data-text="long-text">{String((content) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<RssItem_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='Observations'
				emptyText='No RSS item observations yet.'
				id='RssItem_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
