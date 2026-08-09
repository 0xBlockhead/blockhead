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
		id = 'GlobalEnsNetwork_Timestamps-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalEnsNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalEnsNetwork_Timestamp}
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
	{#snippet Item({ item: globalEnsNetworkTimestamp })}
		{@const globalEnsNetworkTimestampSelector = globalEnsNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalEnsNetwork_Timestamp}
			entitySelector={globalEnsNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(ens)/ens/(globalEnsNetwork)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						timestampMs: String(globalEnsNetworkTimestampSelector.timestampMs),
						source: globalEnsNetworkTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				ENS
			{/snippet}

			{#snippet Value()}
				{globalEnsNetworkTimestampSelector.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
