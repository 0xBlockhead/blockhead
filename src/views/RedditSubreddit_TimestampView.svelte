<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(social)/(reddit)/reddit/r/[name]', {
			name: selector.$subreddit.name,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.RedditSubreddit_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const redditSubredditTimestamp = subscribe(EntityType.RedditSubreddit_Timestamp,
		selector,
		({ sources: [
				Source.Reddit_Rest,
				Source.Reddit_PublicJson,
			], fields: { subscriberCount: true, activeUserCount: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.RedditSubreddit_Timestamp}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	title="Reddit subreddit snapshot"
	{...EntityViewProps}
>
	{#snippet Value()}
		<Timestamp timestamp={selector.timestampMs} />
	{/snippet}

	{#snippet Title()}
		<Timestamp timestamp={selector.timestampMs} />
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Timestamped Reddit subreddit counters resolved from Reddit API and public JSON metadata.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={redditSubredditTimestamp}
			placeholderText="Loading Reddit subreddit snapshot..."
		>
			{#snippet children(redditSubredditTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Subscribers',
								value: redditSubredditTimestamp.fields.subscriberCount,
							},
							{
								label: 'Active users',
								value: redditSubredditTimestamp.fields.activeUserCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
