<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.RedditLink>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.RedditLink>>
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
	const redditLink = $derived(selection({
		sources: selection.sources,
		fields: {
			title: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.title) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.fullname) ?? '')].filter(Boolean).join(' ') || 'Reddit submission')
	const viewDomId = $derived('reddit-link-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
	import RedditLink_TimestampsView from '$/views/RedditLink_TimestampsView.svelte'
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditLink}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.fullname !== undefined ? resolve('/reddit/link/[fullname=stringSegment]', {
			fullname: encodeURIComponent(String(pendingEntity.fullname ?? '')),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.title) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={redditLink}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.title) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const createdAt0 = pendingEntity.createdAt}
			{#if createdAt0 !== undefined && createdAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(createdAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={redditLink}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt0 = resolvedEntity.createdAt}
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
			<div>
				<dt>Submission ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									fullname: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const fullname = resolvedEntity.fullname}
							{#if fullname !== undefined && fullname !== null}
								<TruncatedValue value={String((fullname) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							title: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const title = resolvedEntity.title}
					{#if title !== undefined && title !== null}
						<div>
							<dt>Title</dt>
							<dd>
								{String((title) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								selftext: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const selftext = resolvedEntity.selftext}
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
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								author: true,
							},
						})
					}
				>
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
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								createdAt: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const createdAt = resolvedEntity.createdAt}
						{#if createdAt !== undefined && createdAt !== null}
							<div>
								<dt>Created</dt>
								<dd>
									<Timestamp timestamp={Number(createdAt)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$subreddit}
				>
					{#snippet children(redditSubreddit)}
						{#if redditSubreddit != null && redditSubreddit[EntityMetaKey.Selector] != null}
							<div>
								<dt>Subreddit</dt>
								<dd>
									<RedditSubredditView
										selection={select(EntityType.RedditSubreddit, redditSubreddit[EntityMetaKey.Selector])}
										prefetched={redditSubreddit}
										href={
											(redditSubreddit[EntityMetaKey.Selector].name !== undefined ? resolve('/reddit/r/[name=stringSegment]', {
												name: encodeURIComponent(String(redditSubreddit[EntityMetaKey.Selector].name ?? '')),
											}) : undefined)
										}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								url: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const url = resolvedEntity.url}
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
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								permalink: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const permalink = resolvedEntity.permalink}
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
				selection={
						selection.$$comments({
							sources: [
								Source.Constants_Internal,
								Source.Reddit_PublicJson,
							],
							count: true,
						})
					}
				title='Comments'
				href={
						(selection.entitySelector.fullname !== undefined ? resolve('/reddit/link/[fullname=stringSegment]/comments', {
							fullname: encodeURIComponent(String(selection.entitySelector.fullname ?? '')),
						}) : undefined)
					}
				id='RedditCommentsView-comments'
			/>

			<RedditLink_TimestampsView
				selection={
						selection.$$timestamps({
							sources: [
								Source.Reddit_PublicJson,
							],
							count: true,
						})
					}
				title='Observations'
				href={
						(selection.entitySelector.fullname !== undefined ? resolve('/reddit/link/[fullname=stringSegment]/observations', {
							fullname: encodeURIComponent(String(selection.entitySelector.fullname ?? '')),
						}) : undefined)
					}
				id='RedditLink_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
