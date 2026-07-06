<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
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
		},
	}))
	const titleFallback = $derived([String((prefetched.title) ?? ''), String((selection.entitySelector.guid ?? prefetched.guid) ?? '')].filter(Boolean).join(' ') || 'RSS item')
	const viewDomId = $derived('rss-item-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


<EntityView
	entityType={EntityType.RssItem}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={rssItem}>
			{#snippet Pending()}
				{[String((prefetched.title) ?? ''), String((selection.entitySelector.guid ?? prefetched.guid) ?? '')].filter(Boolean).join(' ') || title || 'RSS item'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.title) ?? ''), String((resolvedEntity.guid) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={rssItem}>
			{#snippet Pending()}
				{@const guid0 = selection.entitySelector.guid ?? prefetched.guid}
				{#if guid0 !== undefined && guid0 !== null}
					<TruncatedValue value={String((guid0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const guid0 = resolvedEntity.guid}
				{#if guid0 !== undefined && guid0 !== null}
					<TruncatedValue value={String((guid0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
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
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const publishedAt0 = resolvedEntity.publishedAt}
				{#if publishedAt0 !== undefined && publishedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(publishedAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.RssFeed, false>('$feed')}
			>
				{#snippet children(rssFeed)}
					{#if rssFeed != null && rssFeed[EntityMetaKey.Selector] != null}
						<div>
							<dt>Feed</dt>
							<dd>
								<RssFeedView
									selection={select(EntityType.RssFeed, rssFeed[EntityMetaKey.Selector])}
									prefetched={rssFeed}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							author: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const author = prefetched.author}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const author = resolvedEntity.author}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							link: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const link = prefetched.link}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const link = resolvedEntity.link}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							publishedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const publishedAt = prefetched.publishedAt}
					{#if publishedAt !== undefined && publishedAt !== null}
						<div>
							<dt>Published</dt>
							<dd>
								<Timestamp timestamp={Number(publishedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const publishedAt = resolvedEntity.publishedAt}
					{#if publishedAt !== undefined && publishedAt !== null}
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
					selection({
						fields: {
							updatedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const updatedAt = prefetched.updatedAt}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updatedAt = resolvedEntity.updatedAt}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							enclosureUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const enclosureUrl = prefetched.enclosureUrl}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const enclosureUrl = resolvedEntity.enclosureUrl}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							commentsUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const commentsUrl = prefetched.commentsUrl}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const commentsUrl = resolvedEntity.commentsUrl}
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

		<ResourceBoundary
			resource={
				selection({
					fields: {
						content: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const content = resolvedEntity.content}
				{#if content !== undefined && content !== null && content !== ''}
					<p data-text="long-text">{String((content) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
