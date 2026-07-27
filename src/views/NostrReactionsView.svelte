<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['A Nostr reaction is a kind-7 event keyed by event id and scoped to the note or article it reacts to.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NostrReaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NostrReaction}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				content: true,
				eventId: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: nostrReaction })}
		{@const nostrReactionSelector = nostrReaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NostrReaction}
			entitySelector={nostrReactionSelector}
			href={
				resolve(
					'/(social)/(nostr)/nostr/(globalNostrNetwork)/reaction/[eventId=stringSegment]',
					{
						eventId: String(nostrReactionSelector.eventId),
					}
				)
			}
		>
			{#snippet Title()}
				{[(nostrReaction.content ?? ''), nostrReactionSelector.eventId].filter(Boolean).join(' ') || nostrReactionSelector.eventId || 'Nostr reaction'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(nostrReaction.createdAt ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
