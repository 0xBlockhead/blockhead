<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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

	const rssFeed = $derived(selection({
		sources: selection.sources ?? [
			Source.Rss_Rest,
			Source.Rss2Json_Rest,
		],
	})({
		fields: {
			title: true,
			description: true,
			siteUrl: true,
			language: true,
			lastBuildDate: true,
		},
	}))
	const titleFallback = $derived([(prefetched.title ?? ''), selection.entitySelector.feedUrl].filter(Boolean).join(' ') || 'RSS feed')


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
		href === undefined ?
			resolve(
				'/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]',
				{
					feedUrl: encodeURIComponent(selection.entitySelector.feedUrl),
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
		<ResourceBoundary resource={rssFeed}>
			{#snippet children(entity)}
				{[(entity.title ?? ''), selection.entitySelector.feedUrl].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.feedUrl} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={rssFeed}>
			{#snippet children(entity)}
				{@const lastBuildDate = entity.lastBuildDate}
				{#if lastBuildDate != null}
					<span data-text="muted">
						<Timestamp timestamp={lastBuildDate} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Feed URL</dt>
				<dd>
					<a
						href={selection.entitySelector.feedUrl}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.feedUrl} />
					</a>
				</dd>
			</div>
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
									href={siteUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={siteUrl} />
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
								<Timestamp timestamp={lastBuildDate} />
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

	{#snippet Details()}
		{@const itemsResource = selection.$$items}
		<ResourceBoundary
			resource={itemsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<RssItemsView
						selection={itemsResource}
						countResource={itemsResource.count}
						title='Items'
						id='items'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<RssFeed_TimestampsView
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
