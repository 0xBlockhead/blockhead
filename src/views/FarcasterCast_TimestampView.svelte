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


	// State
	let {
		entityId,
		href,
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.FarcasterCast_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const farcasterCastTimestamp = useEntity(
		EntityType.FarcasterCast_Timestamp,
		entityId,
		{
			$: [
				Source.Snapchain_Rest,
			],
			likeCount: {},
			recastCount: {},
			replyCount: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterCast_Timestamp}
	{entityId}
	href={href}
	{layout}
	bind:open
	title="Farcaster cast snapshot"
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
			Timestamped Farcaster cast engagement counters resolved from hub-visible reaction and reply data.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={farcasterCastTimestamp}
			placeholderText="Loading Farcaster cast snapshot..."
		>
			{#snippet children(farcasterCastTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Likes',
								value: farcasterCastTimestamp.likeCount,
							},
							{
								label: 'Recasts',
								value: farcasterCastTimestamp.recastCount,
							},
							{
								label: 'Replies',
								value: farcasterCastTimestamp.replyCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
