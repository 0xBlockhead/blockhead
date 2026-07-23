<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			selection: RegisteredEntityProxyResource<EntityType.RedditSubreddit>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.RedditSubreddit>
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
	const redditSubreddit = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			title: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			title: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.title) ?? '')].filter(Boolean).join(' ') || [(String((pendingEntity.name) ?? '') ? 'r/' + String((pendingEntity.name) ?? '') : '')].filter(Boolean).join(' ') || 'Reddit subreddit')
	const viewDomId = $derived('reddit-subreddit-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
	import RedditSubreddit_TimestampsView from '$/views/RedditSubreddit_TimestampsView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditSubreddit}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'name' in selection.entitySelector
			&& selection.entitySelector.name != null ?
				resolve('/reddit/r/[name=stringSegment]', {
			name: encodeURIComponent(String(selection.entitySelector.name ?? '')),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={redditSubreddit}>
			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference != null && reference[EntityMetaKey.Selector] !== undefined}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={redditSubreddit}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.title) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Subreddit</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									name: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const name = resolvedEntity.name}
							{#if name !== undefined && name !== null}
								<span>r/</span>
								{String((name) ?? '')}
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
								publicDescription: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const publicDescription = resolvedEntity.publicDescription}
						{#if publicDescription !== undefined && publicDescription !== null}
							<div>
								<dt>Public description</dt>
								<dd>
									<span data-text="long-text">{String((publicDescription) ?? '')}</span>
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
					resource={
						selection({
							sources: selection.sources,
							fields: {
								over18: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const over18 = resolvedEntity.over18}
						{#if over18 !== undefined && over18 !== null}
							<div>
								<dt>NSFW</dt>
								<dd>
									{over18 ? 'Yes' : 'No'}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const redditSubredditRedditLinksViewLinksResource = selection
		.$$links({
			sources: [
				Source.Reddit_PublicJson,
			],
		})}
				<ResourceBoundary
					resource={redditSubredditRedditLinksViewLinksResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<RedditLinksView
							selection={redditSubredditRedditLinksViewLinksResource}
							countResource={redditSubredditRedditLinksViewLinksResource.count}
							title='Submissions'
							href={
									(selection.entitySelector != null && 'name' in selection.entitySelector && selection.entitySelector.name != null ? resolve('/reddit/r/[name=stringSegment]/links', {
										name: encodeURIComponent(String(selection.entitySelector.name ?? '')),
									}) : undefined)
								}
							id='RedditLinksView-links'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const redditSubredditRedditSubredditTimestampsViewTimestampsResource = selection
		.$$timestamps({
			sources: [
				Source.Reddit_PublicJson,
			],
		})}
				<ResourceBoundary
					resource={redditSubredditRedditSubredditTimestampsViewTimestampsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<RedditSubreddit_TimestampsView
							selection={redditSubredditRedditSubredditTimestampsViewTimestampsResource}
							countResource={redditSubredditRedditSubredditTimestampsViewTimestampsResource.count}
							title='Observations'
							href={
									(selection.entitySelector != null && 'name' in selection.entitySelector && selection.entitySelector.name != null ? resolve('/reddit/r/[name=stringSegment]/observations', {
										name: encodeURIComponent(String(selection.entitySelector.name ?? '')),
									}) : undefined)
								}
							id='RedditSubreddit_TimestampsView-timestamps'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
