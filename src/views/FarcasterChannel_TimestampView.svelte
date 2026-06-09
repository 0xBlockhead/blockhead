<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]', {
			channelId: entityId.$channel.id,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.FarcasterChannel_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const farcasterChannelTimestamp = useEntity(entityCollectionsContext, 
		EntityType.FarcasterChannel_Timestamp,
		entityId,
		({ sources: [
				Source.Farcaster_Rest,
			], fields: { followerCount: true, memberCount: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterChannel_Timestamp}
	{entityId}
	href={href}
	{layout}
	bind:open
	title="Farcaster channel snapshot"
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
			Timestamped Farcaster channel counters resolved from channel registry and membership data.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={farcasterChannelTimestamp}
			placeholderText="Loading Farcaster channel snapshot..."
		>
			{#snippet children(farcasterChannelTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Followers',
								value: farcasterChannelTimestamp.fields.followerCount,
							},
							{
								label: 'Members',
								value: farcasterChannelTimestamp.fields.memberCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
