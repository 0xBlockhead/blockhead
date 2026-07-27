<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.RssFeed> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Rss_Rest,
			Source.Rss2Json_Rest,
		],
	}))
	const rssFeed = $derived(viewSelection({
		fields: {
			title: true,
			description: true,
			link: true,
			siteUrl: true,
			language: true,
			lastBuildDate: true,
			imageUrl: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.title ?? ''), String(pendingEntity.feedUrl ?? '')].filter(Boolean).join(' ') || 'RSS feed')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RssItemsView from '$/views/RssItemsView.svelte'
	import RssFeed_TimestampsView from '$/views/RssFeed_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.RssFeed}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]',
			{
				feedUrl: encodeURIComponent(String(selection.entitySelector.feedUrl)),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={rssFeed}>
			{#snippet children(entity)}
				{[(entity.title ?? ''), String(pendingEntity.feedUrl)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={String(pendingEntity.feedUrl)} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={rssFeed}>
			{#snippet children(entity)}
				{@const lastBuildDate0 = entity.lastBuildDate}
				{#if lastBuildDate0 != null}
					<span data-text="muted">
						<Timestamp timestamp={Number(lastBuildDate0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Feed URL</dt>
				<dd>
					<a
						href={String(pendingEntity.feedUrl)}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={String(pendingEntity.feedUrl)} />
					</a>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={rssFeed}
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
				resource={rssFeed}
			>
				{#snippet children(entity)}
					{@const siteUrl = entity.siteUrl}
					{#if siteUrl != null}
						<div>
							<dt>Site URL</dt>
							<dd>
								<a
									href={String(siteUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(siteUrl)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={rssFeed}
			>
				{#snippet children(entity)}
					{@const language = entity.language}
					{#if language != null}
						<div>
							<dt>Language</dt>
							<dd>
								{language}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={rssFeed}
			>
				{#snippet children(entity)}
					{@const lastBuildDate = entity.lastBuildDate}
					{#if lastBuildDate != null}
						<div>
							<dt>Last build</dt>
							<dd>
								<Timestamp timestamp={Number(lastBuildDate)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={rssFeed}
		>
			{#snippet children(entity)}
				{@const description = entity.description}
				{#if description != null && description !== ''}
					<p data-text="long-text">{description}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const rssFeedRssItemsViewItemsResource = selection.$$items}
		<ResourceBoundary
			resource={rssFeedRssItemsViewItemsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<RssItemsView
						selection={rssFeedRssItemsViewItemsResource}
						countResource={rssFeedRssItemsViewItemsResource.count}
						title='Items'
						id='items'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const rssFeedRssFeedTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={rssFeedRssFeedTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<RssFeed_TimestampsView
						selection={rssFeedRssFeedTimestampsViewTimestampsResource}
						countResource={rssFeedRssFeedTimestampsViewTimestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
