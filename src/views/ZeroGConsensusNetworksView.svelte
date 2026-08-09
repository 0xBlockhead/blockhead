<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			...{
				fields: {
					consensusNetworkId: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: zeroGConsensusNetwork })}
		{@const zeroGConsensusNetworkSelector = zeroGConsensusNetwork[EntityMetaKey.Selector]}
		{@const network = zeroGConsensusNetworkSelector.$network}
		<EntityView
			entityType={EntityType.ZeroGConsensusNetwork}
			entitySelector={zeroGConsensusNetworkSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/consensus-network/[consensusNetworkId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						consensusNetworkId: zeroGConsensusNetworkSelector.consensusNetworkId,
					}
				)
			}
		>
			{#snippet Title()}
				{zeroGConsensusNetworkSelector.consensusNetworkId || 'zero g consensus network'}
			{/snippet}

			{#snippet Value()}
				{zeroGConsensusNetwork.$network.name || (zeroGConsensusNetwork.$network.caip2 == null ? '' : `${zeroGConsensusNetwork.$network.caip2.namespace}:${zeroGConsensusNetwork.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
