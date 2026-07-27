<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { htmlToPlainText } from '$/lib/html.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.ActivityPubNote_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ActivityPubNote_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$note: {
					fields: {
						content: true,
						localStatusId: true,
						createdAt: true,
					},
				},
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: activityPubNoteTimestamp })}
		{@const activityPubNoteTimestampSelector = activityPubNoteTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ActivityPubNote_Timestamp}
			entitySelector={activityPubNoteTimestampSelector}
			href={
				(
					'instanceOrigin' in activityPubNoteTimestampSelector.$note
					&& 'localStatusId' in activityPubNoteTimestampSelector.$note ?
						resolve(
							'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/(activityPubNote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
							{
								instanceOrigin: encodeURIComponent(String(activityPubNoteTimestampSelector.$note.instanceOrigin)),
								localStatusId: String(activityPubNoteTimestampSelector.$note.localStatusId),
								timestampMs: String(activityPubNoteTimestampSelector.timestampMs),
								source: String(activityPubNoteTimestampSelector.source),
							}
						)
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{(([activityPubNoteTimestamp.$note.content == null ? '' : String((htmlToPlainText(activityPubNoteTimestamp.$note.content)) ?? ''), activityPubNoteTimestampSelector.$note.localStatusId].filter(Boolean).join(' ')) || 'ActivityPub note')}
			{/snippet}

			{#snippet Value()}
				{String(activityPubNoteTimestampSelector.timestampMs)}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
