<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.ZeroGConsensusNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGConsensusNetwork}
	bind:open
	resource={
		selection({
			fields: {
				consensusNetworkId: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: zeroGConsensusNetwork })}
		{@const zeroGConsensusNetworkSelector = zeroGConsensusNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ZeroGConsensusNetwork}
			entitySelector={zeroGConsensusNetworkSelector}
		>
			{#snippet Title()}
				{zeroGConsensusNetworkSelector.consensusNetworkId || 'zero g consensus network'}
			{/snippet}

			{#snippet Value()}
				{zeroGConsensusNetwork.$network.name || (zeroGConsensusNetworkSelector.$network.caip2 == null ? '' : `${zeroGConsensusNetworkSelector.$network.caip2.namespace}:${zeroGConsensusNetworkSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
