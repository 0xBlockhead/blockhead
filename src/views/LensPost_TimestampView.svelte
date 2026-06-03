<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(lens)/lens/post/[postId]', {
			postId: entityId.$post.id,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LensPost_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const lensPostTimestamp = useEntity(
		EntityType.LensPost_Timestamp,
		entityId,
		{
			$: [
				Source.Lens_Graphql,
			],
			commentCount: {},
			repostCount: {},
			quoteCount: {},
			bookmarkCount: {},
			collectCount: {},
			reactionCount: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.LensPost_Timestamp}
	{entityId}
	href={href}
	{layout}
	bind:open
	title="Lens post snapshot"
	{...EntityViewProps}
>
	{#snippet Value()}
		<Timestamp timestamp={entityId.timestampMs} />
	{/snippet}

	{#snippet Title()}
		<Timestamp timestamp={entityId.timestampMs} />
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Timestamped Lens post engagement counters resolved from Lens GraphQL post stats.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={lensPostTimestamp}
			placeholderText="Loading Lens post snapshot..."
		>
			{#snippet children(lensPostTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Comments',
								value: lensPostTimestamp.commentCount,
							},
							{
								label: 'Reposts',
								value: lensPostTimestamp.repostCount,
							},
							{
								label: 'Quotes',
								value: lensPostTimestamp.quoteCount,
							},
							{
								label: 'Bookmarks',
								value: lensPostTimestamp.bookmarkCount,
							},
							{
								label: 'Collects',
								value: lensPostTimestamp.collectCount,
							},
							{
								label: 'Reactions',
								value: lensPostTimestamp.reactionCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
