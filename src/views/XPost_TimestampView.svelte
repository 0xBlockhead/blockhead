<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { resolverDefinitionsByEntityType } from '$/resolvers/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(x)/x/post/[postId]', {
			postId: entityId.$post.id,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.XPost_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const xPostTimestamp = useEntity(
		EntityType.XPost_Timestamp,
		entityId,
		{
			$: (
				resolverDefinitionsByEntityType[EntityType.XPost_Timestamp]?.map((resolver) => resolver.source)
				?? [Source.Local_Internal]
			),
			likeCount: {},
			retweetCount: {},
			replyCount: {},
			quoteCount: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.XPost_Timestamp}
	{entityId}
	href={href}
	{layout}
	bind:open
	title="X post snapshot"
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
			Timestamped X post engagement counters resolved from enabled X-compatible post sources.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={xPostTimestamp}
			placeholderText="Loading X post snapshot..."
		>
			{#snippet children(xPostTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Likes',
								value: xPostTimestamp.likeCount,
							},
							{
								label: 'Reposts',
								value: xPostTimestamp.retweetCount,
							},
							{
								label: 'Replies',
								value: xPostTimestamp.replyCount,
							},
							{
								label: 'Quotes',
								value: xPostTimestamp.quoteCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
