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
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve('/(social)/(rss)/rss/feed/[feedKey]', {
			feedKey: entityId.feedKey,
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

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
	{#snippet Value()}
		<TruncatedValue
			value={entityId.feedUrl}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={feed}
			placeholderText="Loading feed…"
		>
			{#snippet children(loadedFeed)}
				{loadedFeed.title ?? entityId.feedUrl}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			An RSS 2.0 or Atom syndication document keyed by feedUrl; items are keyed by guid within that loadedFeed.
		</p>
		<p>
			Metadata resolves from Rss_Rest (direct XML fetch) or Rss2Json (rss2json API proxy) when enabled.
		</p>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={feed}
		>
			{#snippet children(loadedFeed)}
				{#if loadedFeed.lastBuildDate != null}
					<span data-text="muted">
						<Timestamp
							timestamp={loadedFeed.lastBuildDate}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Feed URL</dt>
				<dd>{entityId.feedUrl}</dd>
			</div>

			{#if loadedFeed.description}
				<div>
					<dt>Description</dt>
					<dd>{loadedFeed.description}</dd>
				</div>
			{/if}

			{#if loadedFeed.link}
				<div>
					<dt>Link</dt>
					<dd>
						<a
							href={loadedFeed.link}
							rel="noreferrer"
							target="_blank"
						>{loadedFeed.link}</a>
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
							href={loadedFeed.siteUrl}
							rel="noreferrer"
							target="_blank"
						>{loadedFeed.siteUrl}</a>
					</dd>
				</div>
			{/if}
			{#if (
				open
				&& feed.language
			)}
				<div>
					<dt>Language</dt>
					<dd>{loadedFeed.language}</dd>
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
							timestamp={loadedFeed.lastBuildDate}
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
							href={loadedFeed.imageUrl}
							rel="noreferrer"
							target="_blank"
						>{loadedFeed.imageUrl}</a>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idKey}:carousel-feed`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
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

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Record"
						href={`#${idKey}:feed-record`}
					>Record</a>
					<a
						data-scroll-marker-label="Items"
						href={`#${idKey}:feed-items`}
					>Items</a>
				{/snippet}

				{#snippet body({ open: _paneOpen })}
					<section
						data-scroll-marker-label="Record"
						id={`${idKey}:feed-record`}
					>
						<EntityDetails
							entityType={EntityType.RssFeed}
							{entityId}
						/>
					</section>

					<section
						data-scroll-marker-label="Items"
						id={`${idKey}:feed-items`}
					>
						<RssItemsView
							href={resolve('/rss/items')}
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.RssFeed,
								entityId,
								fieldName: '$$items',
							}}
							id={`${idKey}:feed-items-list`}
							{limit}
							open={_paneOpen}
							title="Items"
						/>
					</section>


				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>
