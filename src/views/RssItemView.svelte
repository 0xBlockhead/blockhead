<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
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
	}: EntitySelectionViewProps<EntityType.RssItem> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Rss_Rest,
			Source.Rss2Json_Rest,
		],
	}))
	const rssItem = $derived(viewSelection({
		fields: {
			title: true,
			link: true,
			publishedAt: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.title ?? ''), (pendingEntity.itemIdentity ?? '')].filter(Boolean).join(' ') || 'RSS item')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RssItem_TimestampsView from '$/views/RssItem_TimestampsView.svelte'
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


<EntityView
	entityType={EntityType.RssItem}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]',
			{
				feedUrl: encodeURIComponent(String(selection.entitySelector.$feed.feedUrl)),
				itemIdentityKind: String(selection.entitySelector.itemIdentityKind),
				itemIdentity: encodeURIComponent(String(selection.entitySelector.itemIdentity)),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={rssItem}>
			{#snippet children(entity)}
				{[(entity.title ?? ''), pendingEntity.itemIdentity].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={pendingEntity.itemIdentity} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={rssItem}>
			{#snippet children(entity)}
				{@const publishedAt0 = entity.publishedAt}
				{#if publishedAt0 != null}
					<span data-text="muted">
						<Timestamp timestamp={Number(publishedAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Feed</dt>
				<dd>
					<RssFeedView
						selection={select(EntityType.RssFeed, selection.entitySelector.$feed)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							author: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const author = entity.author}
					{#if author != null}
						<div>
							<dt>Author</dt>
							<dd>
								{author}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={rssItem}
			>
				{#snippet children(entity)}
					{@const link = entity.link}
					{#if link != null}
						<div>
							<dt>Link</dt>
							<dd>
								<a
									href={String(link)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(link)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={rssItem}
			>
				{#snippet children(entity)}
					{@const publishedAt = entity.publishedAt}
					{#if publishedAt != null}
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
					viewSelection({
						fields: {
							updatedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const updatedAt = entity.updatedAt}
					{#if updatedAt != null}
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
					viewSelection({
						fields: {
							enclosureUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const enclosureUrl = entity.enclosureUrl}
					{#if enclosureUrl != null}
						<div>
							<dt>Enclosure URL</dt>
							<dd>
								<a
									href={String(enclosureUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(enclosureUrl)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							commentsUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const commentsUrl = entity.commentsUrl}
					{#if commentsUrl != null}
						<div>
							<dt>Comments URL</dt>
							<dd>
								<a
									href={String(commentsUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(commentsUrl)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				viewSelection({
					fields: {
						content: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const content = entity.content}
				{#if content != null && content !== ''}
					<p data-text="long-text">{content}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const rssItemRssItemTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={rssItemRssItemTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<RssItem_TimestampsView
						selection={rssItemRssItemTimestampsViewTimestampsResource}
						countResource={rssItemRssItemTimestampsViewTimestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
