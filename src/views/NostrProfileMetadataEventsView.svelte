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
		typeAnnotationParagraphs = ['One cryptographically signed kind-0 metadata version for a stable Nostr profile.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NostrProfileMetadataEvent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NostrProfileMetadataEvent}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				$icon: true,
				displayName: true,
				nip05: true,
				eventId: true,
				pubkey: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: nostrProfileMetadataEvent })}
		{@const nostrProfileMetadataEventSelector = nostrProfileMetadataEvent[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NostrProfileMetadataEvent}
			entitySelector={nostrProfileMetadataEventSelector}
			href={
				resolve(
					'/(social)/(nostr)/nostr/(globalNostrNetwork)/profile-metadata-version/[eventId=stringSegment]',
					{
						eventId: nostrProfileMetadataEventSelector.eventId,
					}
				)
			}
		>
			{#snippet Title()}
				{[(nostrProfileMetadataEvent.displayName ?? ''), (nostrProfileMetadataEvent.nip05 ?? '')].filter(Boolean).join(' ') || nostrProfileMetadataEvent.pubkey || 'Nostr profile metadata event'}
			{/snippet}

			{#snippet Value()}
				{nostrProfileMetadataEventSelector.eventId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nostrProfileMetadataEvent.createdAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
