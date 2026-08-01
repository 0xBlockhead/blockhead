<!-- Generated from APP.ts. -->

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

	const redditSubredditTimestamp = $derived(selection({
		fields: {
			subscriberCount: true,
			activeUserCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditSubreddit_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					name: encodeURIComponent(selection.entitySelector.$subreddit.name),
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={redditSubredditTimestamp}>
			{#snippet children(entity)}
				{@const subscriberCount = entity.subscriberCount}
				{#if subscriberCount != null}
					<NumberValue
						value={subscriberCount}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={redditSubredditTimestamp}>
			{#snippet children(entity)}
				<span data-text="muted">
					{selection.entitySelector.source}
				</span>
				{@const activeUserCount = entity.activeUserCount}
				{#if activeUserCount != null}
					<span data-text="muted">
						<NumberValue
							value={activeUserCount}
						/>

						<span> active</span>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
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
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
