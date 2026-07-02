<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.RssItem>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.RssItem>>
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

	const rssItem = $derived(selection({
		sources: [
			Source.Rss_Rest,
			Source.Rss2Json_Rest,
		],
		fields: {
			title: true,
			link: true,
			publishedAt: true,
			$feed: true,
			...(open && {
				description: true,
				content: true,
				author: true,
				updatedAt: true,
				categories: true,
				enclosureUrl: true,
				commentsUrl: true,
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).title) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).guid) ?? '')].filter(Boolean).join(' ') || 'RSS item')
	const viewDomId = $derived('rss-item-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


<EntityView
	entityType={EntityType.RssItem}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).title) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).guid) ?? '')].filter(Boolean).join(' ') || title || 'RSS item'}
		{:else}
			<ResourceBoundary resource={rssItem}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).title) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).guid) ?? '')].filter(Boolean).join(' ') || title || 'RSS item'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.title) ?? ''), String((entity.guid) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const guid0 = ({ ...selection.entitySelector, ...prefetched }).guid}
			{#if guid0 !== undefined && guid0 !== null}
				<TruncatedValue value={String(guid0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={rssItem}>
				{#snippet Pending()}
					{@const guid0 = ({ ...selection.entitySelector, ...prefetched }).guid}
					{#if guid0 !== undefined && guid0 !== null}
						<TruncatedValue value={String(guid0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const guid0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).guid}
					{#if guid0 !== undefined && guid0 !== null}
						<TruncatedValue value={String(guid0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const publishedAt0 = prefetched.publishedAt}
			{#if publishedAt0 !== undefined && publishedAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(publishedAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={rssItem}>
				{#snippet Pending()}
					{@const publishedAt0 = prefetched.publishedAt}
					{#if publishedAt0 !== undefined && publishedAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(publishedAt0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const publishedAt0 = entity.publishedAt}
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
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.RssFeed, false>('$feed')}
			>
				{#snippet children(rssFeed)}
					{#if rssFeed != null}
						<div>
							<dt>Feed</dt>
							<dd>
								<RssFeedView
									selection={select(EntityType.RssFeed, rssFeed.entitySelector)}
									prefetched={rssFeed}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={rssItem}>
				{#snippet Pending()}
					{@const author = prefetched.author ?? selection.entitySelector.author}
					{#if author !== undefined && author !== null}
						<div>
							<dt>Author</dt>
							<dd>
								{String((author) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const author = entity.author ?? selection.entitySelector.author ?? prefetched.author}
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
			<ResourceBoundary resource={rssItem}>
				{#snippet Pending()}
					{@const link = prefetched.link ?? selection.entitySelector.link}
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

				{#snippet children(entity)}
					{@const link = entity.link ?? selection.entitySelector.link ?? prefetched.link}
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
			<ResourceBoundary resource={rssItem}>
				{#snippet Pending()}
					{@const updatedAt = prefetched.updatedAt ?? selection.entitySelector.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const updatedAt = entity.updatedAt ?? selection.entitySelector.updatedAt ?? prefetched.updatedAt}
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
			<ResourceBoundary resource={rssItem}>
				{#snippet Pending()}
					{@const enclosureUrl = prefetched.enclosureUrl ?? selection.entitySelector.enclosureUrl}
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

				{#snippet children(entity)}
					{@const enclosureUrl = entity.enclosureUrl ?? selection.entitySelector.enclosureUrl ?? prefetched.enclosureUrl}
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
			<ResourceBoundary resource={rssItem}>
				{#snippet Pending()}
					{@const commentsUrl = prefetched.commentsUrl ?? selection.entitySelector.commentsUrl}
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

				{#snippet children(entity)}
					{@const commentsUrl = entity.commentsUrl ?? selection.entitySelector.commentsUrl ?? prefetched.commentsUrl}
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

		<ResourceBoundary resource={rssItem}>
			{#snippet children(entity)}
				{@const content = entity.content ?? selection.entitySelector.content ?? prefetched.content}
				{#if content === undefined || content === null || content === ''}
					<p data-text="muted">No content available.</p>
				{:else}
					<p data-text="long-text">{String((content) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
