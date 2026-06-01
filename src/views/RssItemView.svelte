<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(social)/(rss)/rss/item/[feedKey]/[guid]',
			{
				feedKey: encodeURIComponent(entityId.feedUrl),
				guid: encodeURIComponent(entityId.guid),
			},
		),
		layout,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.RssItem>
			href?: string
			layout?: import('$/components/EntityView.svelte').EntityLayout
			open?: boolean
		},
		never
	> = $props()


	// State
	import { syndicationHtmlToSafeHtml } from '$/lib/markdown.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const item = useEntity(
		EntityType.RssItem,
		entityId,
		{
			$: [
				Source.Rss_Rest,
				Source.Rss2Json_Rest,
			],
			title: {},
			link: {},
			publishedAt: {},
			$feed: {},
			...(open ?
				{
					description: {},
					content: {},
					author: {},
					updatedAt: {},
					categories: {},
					enclosureUrl: {},
					commentsUrl: {},
				}
			:
				{}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


<EntityView
	entityType={EntityType.RssItem}
	{entityId}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.guid}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={item}
			placeholderText="Loading item…"
		>
			{#snippet children(item)}
				{item.title ?? entityId.guid}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={item}
		>
			{#snippet children(item)}
				{#if item.publishedAt != null}
					<span data-text="muted">
						<Timestamp
							timestamp={item.publishedAt}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A syndicated RSS / Atom entry keyed by feedUrl + guid within its source feed.
		</p>
		<p>
			description is the summary; content is the full encoded body when the feed provides it. publishedAt is the syndication date.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={item}
			placeholderText="Loading item…"
		>
			{#snippet children(item)}
				<dl data-column-item="center">
					<div>
						<dt>GUID</dt>
						<dd>
							<TruncatedValue
								endLength={12}
								format={TruncatedValueFormat.Visual}
								startLength={20}
								value={entityId.guid}
							/>
						</dd>
					</div>

					{#if item.$feed}
						<div>
							<dt>Feed</dt>
							<dd>
								<RssFeedView
									entityId={item.$feed[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if item.author}
						<div>
							<dt>Author</dt>
							<dd>{item.author}</dd>
						</div>
					{/if}

					{#if item.link}
						<div>
							<dt>Link</dt>
							<dd>
								<a
									href={item.link}
									rel="noreferrer"
									target="_blank"
								>{item.link}</a>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& item.publishedAt != null
					)}
						<div>
							<dt>Published</dt>
							<dd>
								<Timestamp
									timestamp={item.publishedAt}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& item.updatedAt != null
					)}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp
									timestamp={item.updatedAt}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& item.categories
					)}
						<div>
							<dt>Categories</dt>
							<dd>{item.categories.join(', ')}</dd>
						</div>
					{/if}

					{#if (
						open
						&& item.enclosureUrl
					)}
						<div>
							<dt>Enclosure</dt>
							<dd>
								<a
									href={item.enclosureUrl}
									rel="noreferrer"
									target="_blank"
								>{item.enclosureUrl}</a>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& item.commentsUrl
					)}
						<div>
							<dt>Comments</dt>
							<dd>
								<a
									href={item.commentsUrl}
									rel="noreferrer"
									target="_blank"
								>{item.commentsUrl}</a>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const idKey = stringify(entityId)}
		<CollapsibleTabs
				id={`${idKey}:carousel-item`}
				sectionIdPrefix={idKey}
				sections={[
					{ id: 'description', label: 'Description' },
					{ id: 'content', label: 'Content' },
				]}
				data-card
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Item detail
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionDescription({ id, label })}
					<ResourceBoundary
						resource={item}
						placeholderText="Loading item…"
					>
						{#snippet children(item)}
							{#if item.description}
								<div class="rss-html">
									{@html syndicationHtmlToSafeHtml(item.description)}
								</div>
							{:else}
								<p data-text="muted">No description.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionContent({ id, label })}
					<ResourceBoundary
						resource={item}
						placeholderText="Loading item…"
					>
						{#snippet children(item)}
							{#if item.content}
								<div class="rss-html">
									{@html syndicationHtmlToSafeHtml(item.content)}
								</div>
							{:else}
								<p data-text="muted">No full content.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>


<style>
	.rss-html {
		:global(pre) {
			white-space: pre-wrap;
			word-break: break-word;
		}

		:global(img) {
			max-width: 100%;
			height: auto;
		}
	}
</style>
