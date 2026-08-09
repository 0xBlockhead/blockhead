<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NostrRelay> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NostrRelay}
	bind:open
	resource={
		selection({
			...{
				sources: selection.sources ?? [
					Source.Constants_Internal,
				],
				fields: {
					relayUrl: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: nostrRelay })}
		{@const nostrRelaySelector = nostrRelay[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NostrRelay}
			entitySelector={nostrRelaySelector}
			href={
				resolve(
					'/(social)/(nostr)/nostr/(globalNostrNetwork)/relay/[relayKey=stringSegment]',
					{
						relayKey: encodeURIComponent(nostrRelaySelector.relayUrl),
					}
				)
			}
		>
			{#snippet Title()}
				{nostrRelaySelector.relayUrl || 'Nostr relay'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
