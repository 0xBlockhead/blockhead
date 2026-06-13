<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(youtube)/youtube/playlist/[playlistId]', {
			playlistId: entityId.$playlist.playlistId,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.YouTubePlaylist_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const youTubePlaylistTimestamp = subscribe(EntityType.YouTubePlaylist_Timestamp,
		entityId,
		({ sources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			], fields: { itemCount: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.YouTubePlaylist_Timestamp}
	{entityId}
	href={href}
	{layout}
	bind:open
	title="YouTube playlist snapshot"
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
			Timestamped YouTube playlist counters resolved from YouTube Data API and Piped playlist metadata.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={youTubePlaylistTimestamp}
			placeholderText="Loading YouTube playlist snapshot..."
		>
			{#snippet children(youTubePlaylistTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Items',
								value: youTubePlaylistTimestamp.fields.itemCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
