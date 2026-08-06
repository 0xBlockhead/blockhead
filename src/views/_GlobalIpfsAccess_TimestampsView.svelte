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
		id = 'GlobalIpfsAccess_Timestamps-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalIpfsAccess_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalIpfsAccess_Timestamp}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				$hub: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: globalIpfsAccessTimestamp })}
		{@const globalIpfsAccessTimestampSelector = globalIpfsAccessTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalIpfsAccess_Timestamp}
			entitySelector={globalIpfsAccessTimestampSelector}
			href={
				resolve(
					'/(explore)/(ipfs)/ipfs/(ipfsProtocol)/access/(globalIpfsAccess)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						timestampMs: String(globalIpfsAccessTimestampSelector.timestampMs),
						source: globalIpfsAccessTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				global IPFS access
			{/snippet}

			{#snippet Value()}
				{globalIpfsAccessTimestampSelector.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
