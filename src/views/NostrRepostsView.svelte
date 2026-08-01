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
	}: EntityListViewProps<EntityType.NostrRepost> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NostrRepost}
	bind:open
	resource={
		selection({
			fields: {
				eventId: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: nostrRepost })}
		{@const nostrRepostSelector = nostrRepost[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NostrRepost}
			entitySelector={nostrRepostSelector}
			href={
				resolve(
					'/(social)/(nostr)/nostr/(globalNostrNetwork)/repost/[eventId=stringSegment]',
					{
						eventId: nostrRepostSelector.eventId,
					}
				)
			}
		>
			{#snippet Title()}
				{nostrRepostSelector.eventId || 'Nostr repost'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nostrRepost.createdAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
