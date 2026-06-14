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
		href = resolve('/(social)/(reddit)/reddit/link/[fullname]', {
			fullname: selector.$link.fullname,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.RedditLink_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const redditLinkTimestamp = subscribe(EntityType.RedditLink_Timestamp,
		selector,
		({ sources: [
				Source.Reddit_Rest,
				Source.Reddit_PublicJson,
			], fields: { score: true, commentCount: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.RedditLink_Timestamp}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	title="Reddit post snapshot"
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
			Timestamped Reddit post counters resolved from Reddit API and public JSON listing data.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={redditLinkTimestamp}
			placeholderText="Loading Reddit post snapshot..."
		>
			{#snippet children(redditLinkTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Score',
								value: redditLinkTimestamp.fields.score,
							},
							{
								label: 'Comments',
								value: redditLinkTimestamp.fields.commentCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
