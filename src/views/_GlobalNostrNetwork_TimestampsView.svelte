<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Nostr observations',
		open = $bindable(true),
		id = 'GlobalNostrNetwork_Timestamps-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalNostrNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalNostrNetwork_Timestamp}
	{id}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				source: true,
				reachable: true,
				observedNoteCount: true,
			},
		})
	}
>
	{#snippet Item({ item: globalNostrNetworkTimestamp })}
		{@const globalNostrNetworkTimestampSelector = globalNostrNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalNostrNetwork_Timestamp}
			entitySelector={globalNostrNetworkTimestampSelector}
		>
			{#snippet Title()}
				{globalNostrNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[globalNostrNetworkTimestampSelector.source, String(globalNostrNetworkTimestamp.reachable ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{globalNostrNetworkTimestamp.observedNoteCount ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
