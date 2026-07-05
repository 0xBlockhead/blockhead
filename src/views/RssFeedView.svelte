<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.RssFeed>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.RssFeed>>
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
	const rssFeed = $derived(selection({
		sources: [
			Source.Rss_Rest,
			Source.Rss2Json_Rest,
		],
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
	const titleFallback = $derived([String((prefetched.title) ?? ''), String((selection.entitySelector.feedUrl ?? prefetched.feedUrl) ?? '')].filter(Boolean).join(' ') || 'RSS feed')
	const viewDomId = $derived('rss-feed-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.RssFeed}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={rssFeed}>
			{#snippet Pending()}
				{[String((prefetched.title) ?? ''), String((selection.entitySelector.feedUrl ?? prefetched.feedUrl) ?? '')].filter(Boolean).join(' ') || title || 'RSS feed'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.title) ?? ''), String((resolvedEntity.feedUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={rssFeed}>
			{#snippet Pending()}
				{@const feedUrl0 = selection.entitySelector.feedUrl ?? prefetched.feedUrl}
				{#if feedUrl0 !== undefined && feedUrl0 !== null}
					<TruncatedValue value={String((feedUrl0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const feedUrl0 = resolvedEntity.feedUrl}
				{#if feedUrl0 !== undefined && feedUrl0 !== null}
					<TruncatedValue value={String((feedUrl0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={rssFeed}>
			{#snippet Pending()}
				{@const lastBuildDate0 = prefetched.lastBuildDate}
				{#if lastBuildDate0 !== undefined && lastBuildDate0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(lastBuildDate0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const lastBuildDate0 = resolvedEntity.lastBuildDate}
				{#if lastBuildDate0 !== undefined && lastBuildDate0 !== null}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									feedUrl: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const feedUrl = selection.entitySelector.feedUrl ?? prefetched.feedUrl}
							{#if feedUrl !== undefined && feedUrl !== null}
								<svelte:element
									this={'a'}
									href={String(feedUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(feedUrl)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const feedUrl = resolvedEntity.feedUrl}
							{#if feedUrl !== undefined && feedUrl !== null}
								<svelte:element
									this={'a'}
									href={String(feedUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(feedUrl)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
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
							siteUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const siteUrl = prefetched.siteUrl}
					{#if siteUrl !== undefined && siteUrl !== null}
						<div>
							<dt>Site URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(siteUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(siteUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const siteUrl = resolvedEntity.siteUrl}
					{#if siteUrl !== undefined && siteUrl !== null}
						<div>
							<dt>Site URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(siteUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(siteUrl)} />
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
							language: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const language = prefetched.language}
					{#if language !== undefined && language !== null}
						<div>
							<dt>Language</dt>
							<dd>
								{String((language) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const language = resolvedEntity.language}
					{#if language !== undefined && language !== null}
						<div>
							<dt>Language</dt>
							<dd>
								{String((language) ?? '')}
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
							lastBuildDate: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastBuildDate = prefetched.lastBuildDate}
					{#if lastBuildDate !== undefined && lastBuildDate !== null}
						<div>
							<dt>Last build</dt>
							<dd>
								<Timestamp timestamp={Number(lastBuildDate)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastBuildDate = resolvedEntity.lastBuildDate}
					{#if lastBuildDate !== undefined && lastBuildDate !== null}
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
			resource={
				selection({
					fields: {
						description: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const description = resolvedEntity.description}
				{#if description !== undefined && description !== null && description !== ''}
					<p data-text="long-text">{String((description) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
