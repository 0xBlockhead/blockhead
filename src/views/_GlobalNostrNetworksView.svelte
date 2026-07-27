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
		typeAnnotationParagraphs = ['Nostr is a relay-based social protocol for signed events. Profiles, notes, reposts, and articles are event kinds; relays are transport endpoints and are not global proof that an event exists everywhere.'],
		open = $bindable(true),
		id = 'GlobalNostrNetworks-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalNostrNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalNostrNetwork}
	{id}
	bind:open
	{typeAnnotationParagraphs}
	resource={selection()}
>
	{#snippet Item({ item: globalNostrNetwork })}
		<EntityView
			entityType={EntityType._GlobalNostrNetwork}
			entitySelector={globalNostrNetwork[EntityMetaKey.Selector]}
			href={resolve('/(social)/(nostr)/nostr')}
		>
			{#snippet Title()}
				Nostr
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
