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
		id = 'GlobalAgentNetworks-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalAgentNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalAgentNetwork}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: globalAgentNetwork })}
		{@const globalAgentNetworkSelector = globalAgentNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalAgentNetwork}
			entitySelector={globalAgentNetworkSelector}
			href={
				resolve(
					'/~/agent-network/[networkId=stringSegment]',
					{
						networkId: globalAgentNetworkSelector.networkId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
