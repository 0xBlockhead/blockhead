<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		<EntityView
			entityType={EntityType._GlobalAgentNetwork}
			entitySelector={globalAgentNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				global agent network
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
