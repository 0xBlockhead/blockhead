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
		title = 'Relay observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NostrRelay_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NostrRelay_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					name: true,
					source: true,
					reachable: true,
					software: true,
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: nostrRelayTimestamp })}
		{@const nostrRelayTimestampSelector = nostrRelayTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NostrRelay_Timestamp}
			entitySelector={nostrRelayTimestampSelector}
			href={
				resolve(
					'/(social)/(nostr)/nostr/(globalNostrNetwork)/relay/[relayKey=stringSegment]/(nostrRelay)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						relayKey: encodeURIComponent(nostrRelayTimestampSelector.$relay.relayUrl),
						timestampMs: String(nostrRelayTimestampSelector.timestampMs),
						source: nostrRelayTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{[(nostrRelayTimestamp.name ?? ''), nostrRelayTimestampSelector.source].filter(Boolean).join(' ') || 'Nostr relay timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String(nostrRelayTimestamp.reachable ?? ''), (nostrRelayTimestamp.software ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nostrRelayTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
