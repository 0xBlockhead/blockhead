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
	}: EntityListViewProps<EntityType.SwarmProtocol> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SwarmProtocol}
	bind:open
	resource={
		selection({
			...{
				fields: {
					protocolName: true,
					relationshipModel: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: swarmProtocol })}
		<EntityView
			entityType={EntityType.SwarmProtocol}
			entitySelector={swarmProtocol[EntityMetaKey.Selector]}
			href={resolve('/(swarm)/swarm')}
		>
			{#snippet Title()}
				{swarmProtocol.protocolName || 'Swarm protocol'}
			{/snippet}

			{#snippet Value()}
				{swarmProtocol.relationshipModel}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
