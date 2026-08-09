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
	}: EntityListViewProps<EntityType.NostrNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NostrNetwork}
	bind:open
	resource={
		selection({
			...{
				fields: {
					protocolName: true,
					registryName: true,
					scope: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: nostrNetwork })}
		{@const nostrNetworkSelector = nostrNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NostrNetwork}
			entitySelector={nostrNetworkSelector}
			href={
				nostrNetworkSelector.scope === 'NostrNetwork' ?
					resolve('/(social)/(nostr)/nostr/(globalNostrNetwork)/network')
				:
					undefined
			}
		>
			{#snippet Title()}
				{nostrNetwork.protocolName || nostrNetworkSelector.scope || 'Nostr network'}
			{/snippet}

			{#snippet Value()}
				{nostrNetwork.registryName}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
