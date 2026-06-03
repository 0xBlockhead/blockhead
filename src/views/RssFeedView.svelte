<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(rss)/rss/feed/[feedKey]', {
			feedKey: encodeURIComponent(entityId.feedUrl),
		}),
		limit = 25,
		layout,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.RssFeed>
			href?: string
			limit?: number
			layout?: import('$/components/EntityView.svelte').EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const feed = useEntity(
		EntityType.RssFeed,
		entityId,
		{
			$: [
				Source.Rss_Rest,
				Source.Rss2Json_Rest,
			],
			title: {},
			description: {},
			link: {},
			siteUrl: {},
			language: {},
			lastBuildDate: {},
			imageUrl: {},
			...(open ?
				{
					$$items: {
						$: [
							Source.Rss_Rest,
							Source.Rss2Json_Rest,
						],
					},
				}
			:
				{}),
		},
	)

	const idKey = stringify(entityId)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import RssItemsView from '$/views/RssItemsView.svelte'
</script>


<EntityView
	entityType={EntityType.RssFeed}
	{entityId}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={feed}>
			{#snippet children(feed)}
				{#if feed.imageUrl}
					<IconComponent
						src={feed.imageUrl}
						alt={feed.title ?? entityId.feedUrl}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue
			value={entityId.feedUrl}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={feed}
			placeholderText="Loading feed…"
		>
			{#snippet children(feed)}
				{feed.title ?? entityId.feedUrl}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={feed}
		>
			{#snippet children(feed)}
				{#if feed.lastBuildDate != null}
					<span data-text="muted">
						<Timestamp
							timestamp={feed.lastBuildDate}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			An RSS 2.0 or Atom syndication document keyed by feedUrl; items are keyed by guid within that feed.
		</p>
		<p>
			Metadata resolves from Rss_Rest (direct XML fetch) or Rss2Json (rss2json API proxy) when enabled.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Feed URL</dt>
				<dd>{entityId.feedUrl}</dd>
			</div>

			<ResourceBoundary
				resource={feed}
				placeholderText="Loading feed…"
			>
				{#snippet children(feed)}
					{#if feed.description}
						<p>
							<TruncatedValue
								value={feed.description}
								format={TruncatedValueFormat.Visual}
							/>
						</p>
					{/if}

					{#if feed.link}
						<div>
							<dt>Link</dt>
							<dd>
								<a
									href={feed.link}
									rel="noreferrer"
									target="_blank"
								>{feed.link}</a>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& feed.siteUrl
					)}
						<div>
							<dt>Site</dt>
							<dd>
								<a
									href={feed.siteUrl}
									rel="noreferrer"
									target="_blank"
								>{feed.siteUrl}</a>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& feed.language
					)}
						<div>
							<dt>Language</dt>
							<dd>{feed.language}</dd>
						</div>
					{/if}
					{#if (
						open
						&& feed.lastBuildDate != null
					)}
						<div>
							<dt>Last build</dt>
							<dd>
								<Timestamp
									timestamp={feed.lastBuildDate}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& feed.imageUrl
					)}
						<div>
							<dt>Image</dt>
							<dd>
								<a
									href={feed.imageUrl}
									rel="noreferrer"
									target="_blank"
								>{feed.imageUrl}</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
			id={`${idKey}:carousel-feed`}
			sectionIdPrefix={idKey}
			sections={[
				{ id: 'feed-record', label: 'Record' },
				{ id: 'feed-items', label: 'Items' },
			]}
			data-card
		>
			{#snippet Summary({ open: _summaryOpen })}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Feed
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionFeedRecord({ id, label })}
			{/snippet}

			{#snippet SectionFeedItems({ id, label })}
				<RssItemsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/rss/items')}
					entityFieldReference={{
						entityType: EntityType.RssFeed,
						entityId,
						fieldName: '$$items',
					}}
					id={`${idKey}:feed-items-rssFeeds`}
					{limit}
					open={_open}
					title="Items"
				/>
			{/snippet}
	</CollapsibleTabs>
	{/snippet}
</EntityView>
