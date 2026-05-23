<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		limit = 25,
		layout,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.RssFeed>
			href: string
			limit?: number
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'layout'
			| 'title'
			| 'Details'
			| 'Icon'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'

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
			...(open ?
				{
					description: {},
					link: {},
					siteUrl: {},
					language: {},
					lastBuildDate: {},
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
	{href}
	{layout}
	bind:open
	{...entityViewRest}
>
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
				{#if feed.title}
					{feed.title}
				{:else}
					<TruncatedValue
						value={entityId.feedUrl}
						format={TruncatedValueFormat.Visual}
					/>
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

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if open}
				<div>
					<dt>Description</dt>
					<dd>
						<ResourceBoundary
							resource={feed}
							placeholderText="Loading feed…"
						>
							{#snippet children(feed)}
								{#if feed.description}
									{feed.description}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Link</dt>
					<dd>
						<ResourceBoundary
							resource={feed}
							placeholderText="Loading feed…"
						>
							{#snippet children(feed)}
								{#if feed.link}
									<a
										href={feed.link}
										rel="noreferrer"
										target="_blank"
									>{feed.link}</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Site</dt>
					<dd>
						<ResourceBoundary
							resource={feed}
							placeholderText="Loading feed…"
						>
							{#snippet children(feed)}
								{#if feed.siteUrl}
									<a
										href={feed.siteUrl}
										rel="noreferrer"
										target="_blank"
									>{feed.siteUrl}</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Language</dt>
					<dd>
						<ResourceBoundary
							resource={feed}
							placeholderText="Loading feed…"
						>
							{#snippet children(feed)}
								{#if feed.language}
									{feed.language}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Last build</dt>
					<dd>
						<ResourceBoundary
							resource={feed}
							placeholderText="Loading feed…"
						>
							{#snippet children(feed)}
								{#if feed.lastBuildDate != null}
									<Timestamp
										timestamp={feed.lastBuildDate}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
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
					{#if children}
						<a
							data-scroll-marker-label="More"
							href={`#${idKey}:feed-more`}
						>More</a>
					{/if}
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
							entityFieldReference={{
								entityType: EntityType.RssFeed,
								entityId,
								fieldName: '$$items',
							}}
							href={resolve('/(social)/(rss)/rss/feed/[feedKey]/(feed)/items', {
								feedKey: encodeURIComponent(entityId.feedUrl),
							})}
							id={`${idKey}:feed-items-list`}
							{limit}
							open={_paneOpen}
							title="Items"
						/>
					</section>

					{#if children}
						<section
							data-scroll-marker-label="More"
							id={`${idKey}:feed-more`}
						>
							{@render children()}
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

