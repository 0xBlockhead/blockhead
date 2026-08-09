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
	}: EntityListViewProps<EntityType.NostrProfile> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NostrProfile}
	bind:open
	resource={
		selection({
			...{
				fields: {
					pubkey: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: nostrProfile })}
		{@const nostrProfileSelector = nostrProfile[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NostrProfile}
			entitySelector={nostrProfileSelector}
			href={
				resolve(
					'/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]',
					{
						pubkey: nostrProfileSelector.pubkey,
					}
				)
			}
		>
			{#snippet Title()}
				{nostrProfileSelector.pubkey || 'Nostr profile'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
