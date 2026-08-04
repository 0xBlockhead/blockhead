<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.RedditSubreddit> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Reddit_PublicJson,
		],
	}))
	const redditSubreddit = $derived(viewSelection({
		fields: {
			title: true,
			publicDescription: true,
			createdAt: true,
			over18: true,
			$icon: true,
		},
	}))
	const titleFallback = $derived((prefetched.title ?? '') || 'r/' + selection.entitySelector.name)
	const viewDomId = $derived('reddit-subreddit-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
	import RedditSubreddit_TimestampsView from '$/views/RedditSubreddit_TimestampsView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditSubreddit}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]',
				{
					name: encodeURIComponent(selection.entitySelector.name),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={redditSubreddit}>
			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference != null}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
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

	{#snippet Value()}
		r/{selection.entitySelector.name}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={redditSubreddit}
				>
					{#snippet children(entity)}
						{@const createdAt = entity.createdAt}
						{#if createdAt != null}
							<div>
								<dt>Created</dt>
								<dd>
									<Timestamp timestamp={createdAt} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={redditSubreddit}
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

		{#if contentOpen}
			<ResourceBoundary
				resource={redditSubreddit}
			>
				{#snippet children(entity)}
					{@const publicDescription = entity.publicDescription}
					{#if publicDescription != null && publicDescription !== ''}
						<p data-text="long-text">{publicDescription}</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-reddit-subreddit-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'reddit-subreddit-submissions',
						label: 'Submissions',
					},
				]
			}
			data-card
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionRedditSubredditSubmissions({ id, label })}
				<RedditLinksView
					selection={selection.$$links}
					countResource={selection.$$links.count}
					href={
						resolve(
							'/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/links',
							{
								name: encodeURIComponent(selection.entitySelector.name),
							}
						)
					}
					collapsible={false}
					title={label}
					emptyText='No submissions in this subreddit yet.'
					id={`${id}-list`}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-reddit-subreddit-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'reddit-subreddit-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionRedditSubredditTimestamps({ id, label })}
				<RedditSubreddit_TimestampsView
					selection={selection.$$timestamps}
					countResource={selection.$$timestamps.count}
					href={
						resolve(
							'/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/observations',
							{
								name: encodeURIComponent(selection.entitySelector.name),
							}
						)
					}
					collapsible={false}
					title={label}
					emptyText='No subreddit observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
