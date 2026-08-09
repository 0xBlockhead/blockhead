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
		id = 'GlobalSwarmAccess_Timestamps-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalSwarmAccess_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalSwarmAccess_Timestamp}
	{id}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$hub: true,
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: globalSwarmAccessTimestamp })}
		{@const globalSwarmAccessTimestampSelector = globalSwarmAccessTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalSwarmAccess_Timestamp}
			entitySelector={globalSwarmAccessTimestampSelector}
			href={
				resolve(
					'/(swarm)/swarm/(swarmProtocol)/access/(globalSwarmAccess)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						timestampMs: String(globalSwarmAccessTimestampSelector.timestampMs),
						source: globalSwarmAccessTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				global Swarm access
			{/snippet}

			{#snippet Value()}
				{globalSwarmAccessTimestampSelector.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
