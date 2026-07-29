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
		...EntitiesListProps
	}: EntityListViewProps<EntityType.ZeroGConsensusNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGConsensusNetwork_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$consensusNetwork: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: zeroGConsensusNetworkTimestamp })}
		{@const zeroGConsensusNetworkTimestampSelector = zeroGConsensusNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ZeroGConsensusNetwork_Timestamp}
			entitySelector={zeroGConsensusNetworkTimestampSelector}
		>
			{#snippet Title()}
				{zeroGConsensusNetworkTimestampSelector.$consensusNetwork.consensusNetworkId || 'zero g consensus network'}
			{/snippet}

			{#snippet Value()}
				{zeroGConsensusNetworkTimestampSelector.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
