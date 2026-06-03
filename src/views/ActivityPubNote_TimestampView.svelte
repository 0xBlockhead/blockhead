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
		href = resolve(
			'/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]',
			{
				instanceOrigin: encodeURIComponent(entityId.$note.instanceOrigin),
				localStatusId: entityId.$note.localStatusId,
			},
		),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ActivityPubNote_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const activityPubNoteTimestamp = useEntity(
		EntityType.ActivityPubNote_Timestamp,
		entityId,
		{
			$: [
				Source.Mastodon_Rest,
				Source.Fedi_Rest,
			],
			favouriteCount: {},
			reblogCount: {},
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
	entityType={EntityType.ActivityPubNote_Timestamp}
	{entityId}
	href={href}
	{layout}
	bind:open
	title="ActivityPub note snapshot"
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
			Timestamped ActivityPub note counters resolved from provider-visible Mastodon-compatible status data.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={activityPubNoteTimestamp}
			placeholderText="Loading ActivityPub note snapshot..."
		>
			{#snippet children(activityPubNoteTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Favourites',
								value: activityPubNoteTimestamp.favouriteCount,
							},
							{
								label: 'Reblogs',
								value: activityPubNoteTimestamp.reblogCount,
							},
							{
								label: 'Replies',
								value: activityPubNoteTimestamp.replyCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
