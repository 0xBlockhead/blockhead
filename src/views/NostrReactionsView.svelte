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
						eventId: nostrReactionSelector.eventId,
					}
				)
			}
		>
			{#snippet Title()}
				{[(nostrReaction.content ?? ''), nostrReactionSelector.eventId].filter(Boolean).join(' ') || nostrReactionSelector.eventId || 'Nostr reaction'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nostrReaction.createdAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
