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
			selection: EntityProxyResource<typeof schema, EntityType.RedditLink>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.RedditLink>>
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

	const redditLink = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			title: true,
			createdAt: true,
			selftext: true,
			author: true,
			url: true,
			permalink: true,
			...(open && {
				$$comments: true,
				$subreddit: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).title) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.fullname) ?? '')].filter(Boolean).join(' ') || 'Reddit submission')
	const viewDomId = $derived('reddit-link-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditLink}
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
			{[String((({ ...selection.entitySelector, ...prefetched }).title) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.fullname) ?? '')].filter(Boolean).join(' ') || 'Reddit submission'}
		{:else}
			<ResourceBoundary resource={redditLink}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).title) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.fullname) ?? '')].filter(Boolean).join(' ') || 'Reddit submission'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.title) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const createdAt0 = prefetched.createdAt}
			{#if createdAt0 !== undefined && createdAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(createdAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={redditLink}>
				{#snippet Pending()}
					{@const createdAt0 = prefetched.createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(createdAt0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const createdAt0 = entity.createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(createdAt0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary resource={redditLink}>
					{#snippet Pending()}
						{@const selftext = prefetched.selftext ?? selection.entitySelector.selftext}
						{#if selftext !== undefined && selftext !== null}
							<div>
								<dt>Body</dt>
								<dd>
									<span data-text="long-text">{String((selftext) ?? '')}</span>
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const selftext = entity.selftext ?? selection.entitySelector.selftext ?? prefetched.selftext}
						{#if selftext !== undefined && selftext !== null}
							<div>
								<dt>Body</dt>
								<dd>
									<span data-text="long-text">{String((selftext) ?? '')}</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={redditLink}>
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
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.RedditSubreddit, false>('$subreddit')}
				>
					{#snippet children(redditSubreddit)}
						{#if redditSubreddit != null}
							<div>
								<dt>Subreddit</dt>
								<dd>
									<RedditSubredditView
										selection={select(EntityType.RedditSubreddit, redditSubreddit.entitySelector)}
										prefetched={redditSubreddit}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={redditLink}>
					{#snippet Pending()}
						{@const url = prefetched.url ?? selection.entitySelector.url}
						{#if url !== undefined && url !== null}
							<div>
								<dt>URL</dt>
								<dd>
									<svelte:element
										this={'a'}
										href={String(url)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(url)} />
									</svelte:element>
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const url = entity.url ?? selection.entitySelector.url ?? prefetched.url}
						{#if url !== undefined && url !== null}
							<div>
								<dt>URL</dt>
								<dd>
									<svelte:element
										this={'a'}
										href={String(url)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(url)} />
									</svelte:element>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={redditLink}>
					{#snippet Pending()}
						{@const permalink = prefetched.permalink ?? selection.entitySelector.permalink}
						{#if permalink !== undefined && permalink !== null}
							<div>
								<dt>Reddit permalink</dt>
								<dd>
									<svelte:element
										this={'a'}
										href={String(permalink)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(permalink)} />
									</svelte:element>
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const permalink = entity.permalink ?? selection.entitySelector.permalink ?? prefetched.permalink}
						{#if permalink !== undefined && permalink !== null}
							<div>
								<dt>Reddit permalink</dt>
								<dd>
									<svelte:element
										this={'a'}
										href={String(permalink)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(permalink)} />
									</svelte:element>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<RedditCommentsView
				selection={selection[EntityProxyField]<EntityType.RedditComment>('$$comments')}
				title='Comments'
				id='RedditCommentsView-$$comments'
			/>
		{/if}
	{/snippet}
</EntityView>
