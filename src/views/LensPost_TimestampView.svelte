<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(social)/(lens)/lens/post/[postId]', {
			postId: selector.$post.id,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.LensPost_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.LensPost_Timestamp}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	title="Lens post snapshot"
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
			Timestamped Lens post engagement counters resolved from Lens GraphQL post stats.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={proxy(EntityType.LensPost_Timestamp,
					selector,
					({ sources: [
							Source.Lens_Graphql,
						], fields: { commentCount: true, repostCount: true, quoteCount: true, bookmarkCount: true, collectCount: true, reactionCount: true } }),
				)}
			placeholderText="Loading Lens post snapshot..."
		>
			{#snippet children(lensPostTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Comments',
								value: lensPostTimestamp.fields.commentCount,
							},
							{
								label: 'Reposts',
								value: lensPostTimestamp.fields.repostCount,
							},
							{
								label: 'Quotes',
								value: lensPostTimestamp.fields.quoteCount,
							},
							{
								label: 'Bookmarks',
								value: lensPostTimestamp.fields.bookmarkCount,
							},
							{
								label: 'Collects',
								value: lensPostTimestamp.fields.collectCount,
							},
							{
								label: 'Reactions',
								value: lensPostTimestamp.fields.reactionCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
