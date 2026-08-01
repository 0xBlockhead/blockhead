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
	}: EntityListViewProps<EntityType.NostrArticleEvent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NostrArticleEvent}
	bind:open
	resource={
		selection({
			fields: {
				title: true,
				identifier: true,
				eventId: true,
				createdAt: true,
				sensitive: true,
				contentWarning: true,
			},
		})
	}
>
	{#snippet Item({ item: nostrArticleEvent })}
		{@const nostrArticleEventSelector = nostrArticleEvent[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NostrArticleEvent}
			entitySelector={nostrArticleEventSelector}
			href={
				resolve(
					'/(social)/(nostr)/nostr/(globalNostrNetwork)/article-version/[eventId=stringSegment]',
					{
						eventId: nostrArticleEventSelector.eventId,
					}
				)
			}
		>
			{#snippet Title()}
				{[(nostrArticleEvent.title ?? ''), nostrArticleEvent.identifier].filter(Boolean).join(' ') || nostrArticleEventSelector.eventId || 'Nostr article event'}
			{/snippet}

			{#snippet Value()}
				{nostrArticleEventSelector.eventId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nostrArticleEvent.createdAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
