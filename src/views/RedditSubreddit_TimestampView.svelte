<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.RedditSubreddit_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const redditSubredditTimestamp = $derived(selection({
		fields: {
			subscriberCount: true,
			activeUserCount: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'Reddit subreddit timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditSubreddit_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
			{
				name: encodeURIComponent(String(selection.entitySelector.$subreddit.name)),
				timestampMs: String(selection.entitySelector.timestampMs),
				source: String(selection.entitySelector.source),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={redditSubredditTimestamp}>
			{#snippet children(entity)}
				{@const subscriberCount0 = entity.subscriberCount}
				{#if subscriberCount0 != null}
					<NumberValue
						value={subscriberCount0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={redditSubredditTimestamp}>
			{#snippet children(entity)}
				<span data-text="muted">
					{pendingEntity.source}
				</span>
				{@const activeUserCount1 = entity.activeUserCount}
				{#if activeUserCount1 != null}
					<span data-text="muted">
						<NumberValue
							value={activeUserCount1}
						/>

						<span> active</span>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={redditSubredditTimestamp}
			>
				{#snippet children(entity)}
					{@const subscriberCount = entity.subscriberCount}
					{#if subscriberCount != null}
						<div>
							<dt>Subscribers</dt>
							<dd>
								<NumberValue
									value={subscriberCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={redditSubredditTimestamp}
			>
				{#snippet children(entity)}
					{@const activeUserCount = entity.activeUserCount}
					{#if activeUserCount != null}
						<div>
							<dt>Active users</dt>
							<dd>
								<NumberValue
									value={activeUserCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Subreddit</dt>
				<dd>
					<RedditSubredditView
						selection={select(EntityType.RedditSubreddit, selection.entitySelector.$subreddit)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
