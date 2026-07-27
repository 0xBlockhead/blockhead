<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.RedditSubreddit> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Reddit_PublicJson,
		],
	}))
	const redditSubreddit = $derived(viewSelection({
		fields: {
			title: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.title ?? '') || ((pendingEntity.name ?? '') ? 'r/' + (pendingEntity.name ?? '') : '') || 'Reddit subreddit')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
	import RedditSubreddit_TimestampsView from '$/views/RedditSubreddit_TimestampsView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditSubreddit}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]',
			{
				name: encodeURIComponent(String(selection.entitySelector.name)),
			}
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
				{(entity.title ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Subreddit</dt>
				<dd>
					<span>r/</span>
					{pendingEntity.name}
				</dd>
			</div>

			<ResourceBoundary
				resource={redditSubreddit}
			>
				{#snippet children(entity)}
					{@const title = entity.title}
					{#if title != null}
						<div>
							<dt>Title</dt>
							<dd>
								{title}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								publicDescription: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const publicDescription = entity.publicDescription}
						{#if publicDescription != null}
							<div>
								<dt>Public description</dt>
								<dd>
									<span data-text="long-text">{publicDescription}</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								createdAt: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const createdAt = entity.createdAt}
						{#if createdAt != null}
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
						viewSelection({
							fields: {
								over18: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const over18 = entity.over18}
						{#if over18 != null}
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
		{@const redditSubredditRedditLinksViewLinksResource = selection.$$links}
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
							resolve(
								'/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/links',
								{
									name: encodeURIComponent(String(selection.entitySelector.name)),
								}
							)
						}
						id='links'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const redditSubredditRedditSubredditTimestampsViewTimestampsResource = selection.$$timestamps}
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
							resolve(
								'/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/observations',
								{
									name: encodeURIComponent(String(selection.entitySelector.name)),
								}
							)
						}
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
