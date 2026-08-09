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
		title = 'global agent network observations',
		open = $bindable(true),
		id = 'GlobalAgentNetwork_Timestamps-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalAgentNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalAgentNetwork_Timestamp}
	{id}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					status: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: globalAgentNetworkTimestamp })}
		{@const globalAgentNetworkTimestampSelector = globalAgentNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalAgentNetwork_Timestamp}
			entitySelector={globalAgentNetworkTimestampSelector}
			href={
				resolve(
					'/~/agent-network/[networkId=stringSegment]/(globalAgentNetwork)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						networkId: globalAgentNetworkTimestampSelector.$network.networkId,
						timestampMs: String(globalAgentNetworkTimestampSelector.timestampMs),
						source: globalAgentNetworkTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{globalAgentNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{globalAgentNetworkTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{globalAgentNetworkTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
