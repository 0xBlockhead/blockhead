<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NostrNote> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NostrNote}
	bind:open
	resource={
		selection({
			fields: {
				content: true,
				eventId: true,
				createdAt: true,
				sensitive: true,
				contentWarning: true,
			},
		})
	}
>
	{#snippet Item({ item: nostrNote })}
		{@const nostrNoteSelector = nostrNote[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NostrNote}
			entitySelector={nostrNoteSelector}
			href={
				resolve(
					'/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]',
					{
						eventId: nostrNoteSelector.eventId,
					}
				)
			}
		>
			{#snippet Title()}
				{[(nostrNote.content ?? ''), nostrNoteSelector.eventId].filter(Boolean).join(' ') || nostrNoteSelector.eventId || 'Nostr note'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nostrNote.createdAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
