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
		href = resolve(
			'/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]',
			{
				instanceOrigin: encodeURIComponent(selector.$note.instanceOrigin),
				localStatusId: selector.$note.localStatusId,
			},
		),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.ActivityPubNote_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const activityPubNoteTimestamp = subscribe(EntityType.ActivityPubNote_Timestamp,
		selector,
		({ sources: [
				Source.Mastodon_Rest,
				Source.Fedi_Rest,
			], fields: { favouriteCount: true, reblogCount: true, replyCount: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubNote_Timestamp}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	title="ActivityPub note snapshot"
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
								value: activityPubNoteTimestamp.fields.favouriteCount,
							},
							{
								label: 'Reblogs',
								value: activityPubNoteTimestamp.fields.reblogCount,
							},
							{
								label: 'Replies',
								value: activityPubNoteTimestamp.fields.replyCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
