<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

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
	const titleFallback = $derived([(prefetched.title ?? ''), selection.entitySelector.itemIdentity].filter(Boolean).join(' ') || 'RSS item')


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
		href === undefined ?
			resolve(
				'/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]',
				{
					feedUrl: encodeURIComponent(selection.entitySelector.$feed.feedUrl),
					itemIdentityKind: selection.entitySelector.itemIdentityKind,
					itemIdentity: encodeURIComponent(selection.entitySelector.itemIdentity),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={rssItem}>
			{#snippet children(entity)}
				{[(entity.title ?? ''), selection.entitySelector.itemIdentity].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.itemIdentity} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={rssItem}>
			{#snippet children(entity)}
				{@const publishedAt = entity.publishedAt}
				{#if publishedAt != null}
					<span data-text="muted">
						<Timestamp timestamp={publishedAt} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Feed</dt>
				<dd>
					<RssFeedView
						selection={select(EntityType.RssFeed, selection.entitySelector.$feed)}
						layout={EntityLayout.Value}
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
				resource={
					viewSelection({
						fields: {
							categories: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const categories = entity.categories}
					{#if categories != null}
						<div>
							<dt>Categories</dt>
							<dd>
								{categories.join(', ')}
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
									href={link}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={link} />
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
								<Timestamp timestamp={publishedAt} />
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
								<Timestamp timestamp={updatedAt} />
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
									href={enclosureUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={enclosureUrl} />
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
									href={commentsUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={commentsUrl} />
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

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<RssItem_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
