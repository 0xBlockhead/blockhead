<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.FilecoinMiner> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMiner}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Lotus_JsonRpc,
			],
			fields: {
				minerAddress: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinMiner })}
		{@const filecoinMinerSelector = filecoinMiner[EntityMetaKey.Selector]}
		{@const network = filecoinMinerSelector.$network}
		<EntityView
			entityType={EntityType.FilecoinMiner}
			entitySelector={filecoinMinerSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						minerAddress: filecoinMinerSelector.minerAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{filecoinMinerSelector.minerAddress || 'filecoin miner'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
