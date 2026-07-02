<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			...(open && {
				$$items: true,
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).title) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).feedUrl) ?? '')].filter(Boolean).join(' ') || 'RSS feed')
	const viewDomId = $derived('rss-feed-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.RssFeed}
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
			{[String((({ ...selection.entitySelector, ...prefetched }).title) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).feedUrl) ?? '')].filter(Boolean).join(' ') || title || 'RSS feed'}
		{:else}
			<ResourceBoundary resource={rssFeed}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).title) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).feedUrl) ?? '')].filter(Boolean).join(' ') || title || 'RSS feed'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.title) ?? ''), String((entity.feedUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const feedUrl0 = ({ ...selection.entitySelector, ...prefetched }).feedUrl}
			{#if feedUrl0 !== undefined && feedUrl0 !== null}
				<TruncatedValue value={String(feedUrl0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={rssFeed}>
				{#snippet Pending()}
					{@const feedUrl0 = ({ ...selection.entitySelector, ...prefetched }).feedUrl}
					{#if feedUrl0 !== undefined && feedUrl0 !== null}
						<TruncatedValue value={String(feedUrl0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const feedUrl0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).feedUrl}
					{#if feedUrl0 !== undefined && feedUrl0 !== null}
						<TruncatedValue value={String(feedUrl0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const lastBuildDate0 = prefetched.lastBuildDate}
			{#if lastBuildDate0 !== undefined && lastBuildDate0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(lastBuildDate0)} />
				</span>
			{/if}
		{:else}
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
					{@const lastBuildDate0 = entity.lastBuildDate}
					{#if lastBuildDate0 !== undefined && lastBuildDate0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(lastBuildDate0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={rssFeed}>
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
			<ResourceBoundary resource={rssFeed}>
				{#snippet Pending()}
					{@const siteUrl = prefetched.siteUrl ?? selection.entitySelector.siteUrl}
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
					{@const siteUrl = entity.siteUrl ?? selection.entitySelector.siteUrl ?? prefetched.siteUrl}
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
			<ResourceBoundary resource={rssFeed}>
				{#snippet Pending()}
					{@const language = prefetched.language ?? selection.entitySelector.language}
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
					{@const language = entity.language ?? selection.entitySelector.language ?? prefetched.language}
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

		<ResourceBoundary resource={rssFeed}>
			{#snippet children(entity)}
				{@const description = entity.description ?? selection.entitySelector.description ?? prefetched.description}
				{#if description === undefined || description === null || description === ''}
					<p data-text="muted">No description available.</p>
				{:else}
					<p data-text="long-text">{String((description) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
