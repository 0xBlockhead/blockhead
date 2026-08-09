<!-- Generated from APP.ts. -->

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
			...{
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
			},
		})
	}
>
	{#snippet Item({ item: activityPubNoteTimestamp })}
		{@const activityPubNoteTimestampSelector = activityPubNoteTimestamp[EntityMetaKey.Selector]}
		{@const note = activityPubNoteTimestampSelector.$note}
		<EntityView
			entityType={EntityType.ActivityPubNote_Timestamp}
			entitySelector={activityPubNoteTimestampSelector}
			href={
				'instanceOrigin' in note
				&& 'localStatusId' in note ?
					resolve(
						'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/(activityPubNote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							instanceOrigin: encodeURIComponent(note.instanceOrigin),
							localStatusId: note.localStatusId,
							timestampMs: String(activityPubNoteTimestampSelector.timestampMs),
							source: activityPubNoteTimestampSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{[activityPubNoteTimestamp.$note.content == null ? '' : htmlToPlainText(activityPubNoteTimestamp.$note.content), activityPubNoteTimestamp.$note.localStatusId].filter(Boolean).join(' ') || 'ActivityPub note'}
			{/snippet}

			{#snippet Value()}
				{activityPubNoteTimestampSelector.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
