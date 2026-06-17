<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/(social)/(rss)/rss/item/[feedKey]/[guid]',
			{
				feedKey: encodeURIComponent(selector.feedUrl),
				guid: encodeURIComponent(selector.guid),
			},
		),
		layout,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.RssItem>
			href?: string
			layout?: import('$/components/EntityView.svelte').EntityLayout
			open?: boolean
		},
		never
	> = $props()

	import { syndicationHtmlToSafeHtml } from '$/lib/markdown.ts'
	import { proxy } from '$/routes/+layout.svelte'

	const item = $derived(proxy(EntityType.RssItem, selector, ({ sources: [
				Source.Rss_Rest,
				Source.Rss2Json_Rest,
			], fields: { title: true, link: true, publishedAt: true, $feed: true, ...(open ? ({ description: true, content: true, author: true, updatedAt: true, categories: true, enclosureUrl: true, commentsUrl: true }) : ({  })) } })))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


<EntityView
	entityType={EntityType.RssItem}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={selector.guid}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={item}
			placeholderText="Loading item…"
		>
			{#snippet children(item)}
				{item.fields.title ?? selector.guid}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={item}
		>
			{#snippet children(item)}
				{#if item.fields.publishedAt != null}
					<span data-text="muted">
						<Timestamp
							timestamp={item.fields.publishedAt}
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
								value={selector.guid}
							/>
						</dd>
					</div>

					{#if item.fields.$feed}
						<div>
							<dt>Feed</dt>
							<dd>
								<RssFeedView
									selector={item.fields.$feed[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}

									open={false}
									/>
							</dd>
						</div>
					{/if}

					{#if item.fields.author}
						<div>
							<dt>Author</dt>
							<dd>{item.fields.author}</dd>
						</div>
					{/if}

					{#if item.fields.link}
						<div>
							<dt>Link</dt>
							<dd>
								<a
									href={item.fields.link}
									rel="noreferrer"
									target="_blank"
								>{item.fields.link}</a>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& item.fields.publishedAt != null
					)}
						<div>
							<dt>Published</dt>
							<dd>
								<Timestamp
									timestamp={item.fields.publishedAt}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& item.fields.updatedAt != null
					)}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp
									timestamp={item.fields.updatedAt}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& item.fields.categories
					)}
						<div>
							<dt>Categories</dt>
							<dd>{item.fields.categories.join(', ')}</dd>
						</div>
					{/if}

					{#if (
						open
						&& item.fields.enclosureUrl
					)}
						<div>
							<dt>Enclosure</dt>
							<dd>
								<a
									href={item.fields.enclosureUrl}
									rel="noreferrer"
									target="_blank"
								>{item.fields.enclosureUrl}</a>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& item.fields.commentsUrl
					)}
						<div>
							<dt>Comments</dt>
							<dd>
								<a
									href={item.fields.commentsUrl}
									rel="noreferrer"
									target="_blank"
								>{item.fields.commentsUrl}</a>
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
		{@const idKey = stringify(selector)}
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
						{#if item.fields.description}
							<div class="rss-html">
								{@html syndicationHtmlToSafeHtml(item.fields.description)}
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
						{#if item.fields.content}
							<div class="rss-html">
								{@html syndicationHtmlToSafeHtml(item.fields.content)}
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
