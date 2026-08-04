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
				instanceOrigin: true,
				localStatusId: true,
				content: true,
				createdAt: true,
				sensitive: true,
				spoilerText: true,
			},
		})
	}
>
	{#snippet Item({ item: activityPubNote })}
		<EntityView
			entityType={EntityType.ActivityPubNote}
			entitySelector={activityPubNote[EntityMetaKey.Selector]}
			href={
				resolve(
					'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]',
					{
						instanceOrigin: encodeURIComponent(activityPubNote.instanceOrigin),
						localStatusId: activityPubNote.localStatusId,
					}
				)
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
