<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = (
			'instanceOrigin' in selection.entitySelector.$note ?
				resolve(
					'/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]',
					{
						instanceOrigin: encodeURIComponent(selection.entitySelector.$note.instanceOrigin),
						localStatusId: selection.entitySelector.$note.localStatusId,
					},
				)
			:
				undefined
		),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.ActivityPubNote_Timestamp>
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
	entityType={EntityType.ActivityPubNote_Timestamp}
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	title="ActivityPub note snapshot"
	{...EntityViewProps}
>
	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Timestamped ActivityPub note counters resolved from provider-visible Mastodon-compatible status data.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ sources: [
							Source.Mastodon_Rest,
							Source.Fedi_Rest,
						], fields: { favouriteCount: true, reblogCount: true, replyCount: true } }),
				)}
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
