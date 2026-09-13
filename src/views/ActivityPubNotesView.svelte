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
	}: EntityListViewProps<EntityType.ActivityPubNote> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ActivityPubNote}
	bind:open
	resource={
		selection({
			fields: {
				content: true,
				localStatusId: true,
				createdAt: true,
				sensitive: true,
				spoilerText: true,
			},
		})
	}
>
	{#snippet Item({ item: activityPubNote })}
		{@const activityPubNoteSelector = activityPubNote[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ActivityPubNote}
			entitySelector={activityPubNoteSelector}
			href={
				activityPubNoteSelector.instanceOrigin !== undefined
				&& activityPubNoteSelector.localStatusId !== undefined ?
					resolve(
						'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]',
						{
							instanceOrigin: encodeURIComponent(activityPubNoteSelector.instanceOrigin),
							localStatusId: activityPubNoteSelector.localStatusId,
						}
					)
				:
					activityPubNoteSelector.activityStreamsUri !== undefined ?
						resolve(
							'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[activityStreamsUri=stringSegment]',
							{
								activityStreamsUri: activityPubNoteSelector.activityStreamsUri,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{[activityPubNote.content == null ? '' : htmlToPlainText(activityPubNote.content), activityPubNote.localStatusId].filter(Boolean).join(' ') || 'ActivityPub note'}
			{/snippet}

			{#snippet Value()}
				{[String(activityPubNote.createdAt ?? ''), activityPubNote.localStatusId].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
